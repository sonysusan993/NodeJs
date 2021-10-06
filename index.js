require('dotenv').config();
const net = require('net');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { db } = require('./db');

const version = "1.0.0 [beta]";
const stores = {
  "aldi-nord": {
      "name": "Aldi Nord (DE)",
      "url": "https://www.aldi-nord.de/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Cart Hold"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "aldi-uk": {
      "name": "Aldi UK",
      "url": "https://www.aldi.co.uk",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Cart Hold"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "alternate": {
      "name": "Alternate",
      "url": "https://www.alternate.de",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal",
          "PayPal Express",
          "Wire Transfer"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "amazon-de": {
      "name": "Amazon DE",
      "url": "https://www.amazon.de/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasPriceLimit": true,
      "hasSellerId": true
  },
  "amazon-es": {
      "name": "Amazon ES",
      "url": "https://www.amazon.es/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasPriceLimit": true,
      "hasSellerId": true
  },
  "amazon-fr": {
      "name": "Amazon FR",
      "url": "https://www.amazon.fr/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasPriceLimit": true,
      "hasSellerId": true
  },
  "amazon-uk": {
      "name": "Amazon UK",
      "url": "https://www.amazon.co.uk/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasPriceLimit": true,
      "hasSellerId": true
  },
  "amd": {
      "name": "Amd",
      "url": "https://www.amd.com",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal",
          "3DS Bypass"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "argos": {
      "name": "Argos",
      "url": "https://www.argos.co.uk",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "argos-collection": {
      "name": "Argos Collection",
      "url": "https://www.argos.co.uk",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": true
  },
  "aw-lab": {
      "name": "Aw-Lab",
      "url": "https://aw-lab.com",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal",
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal",
          "Skip"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "board-game": {
      "name": "Board Game (Zatu)",
      "url": "https://www.board-game.co.uk/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "chaos-cards": {
      "name": "Chaos Cards",
      "url": "https://www.chaoscards.co.uk/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "converse": {
      "name": "Converse",
      "url": "https://production-store-converse.demandware.net/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal",
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal",
          "Preload"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": true,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "currys": {
      "name": "Currys",
      "url": "https://www.currys.co.uk",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal",
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "currys-backend": {
      "name": "Currys Backend",
      "url": "https://www.currys.co.uk",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal",
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "direct-asda": {
      "name": "Direct Asda",
      "url": "https://directasda.com",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "disney": {
      "name": "Disney",
      "url": "https://www.shopdisney.eu",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "game-uk": {
      "name": "Game UK",
      "url": "https://game.co.uk",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "here-store": {
      "name": "Here Store",
      "url": "https://www.here-store.com",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal",
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal",
          "Skip"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "kith-eu": {
      "name": "Kith EU",
      "url": "https://eu.kith.com/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "Sofort"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any",
          "2.5",
          "3",
          "3.5",
          "4",
          "4.5",
          "5",
          "5.5",
          "6",
          "6.5",
          "7",
          "7.5",
          "8",
          "8.5",
          "9",
          "9.5",
          "10",
          "10.5",
          "11",
          "11.5",
          "12",
          "12.5",
          "13",
          "13.5",
          "14",
          "14.5",
          "15"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "ldlc": {
      "name": "Ldlc",
      "url": "https://www.ldlc.com",
      "accountSupport": true,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal",
          "Wire Transfer"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "magic-madhouse": {
      "name": "Magic Madhouse",
      "url": "https://www.magicmadhouse.co.uk",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "mediamarkt": {
      "name": "Media Markt",
      "url": "https://www.mediamarkt.es/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal",
          "Wire Transfer",
          "In-Store Payment"
      ],
      "checkoutModes": [
          "Monitor",
          "ATC"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": true,
      "hasStateId": false,
      "hasStoreId": true
  },
  "medimax": {
      "name": "Medimax",
      "url": "https://www.medimax.de",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "naked": {
      "name": "Naked",
      "url": "https://nakedcph.com/",
      "accountSupport": true,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "newbalance": {
      "name": "NewBalance",
      "url": "https://production-emea-newbalance.demandware.net/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any",
          "0.5",
          "1",
          "1.5",
          "2",
          "2.5",
          "3",
          "3.5",
          "4",
          "4.5",
          "5",
          "5.5",
          "6",
          "6.5",
          "7",
          "7.5",
          "8",
          "8.5",
          "9",
          "9.5",
          "10",
          "10.5",
          "11",
          "11.5",
          "12",
          "12.5",
          "13",
          "13.5",
          "14",
          "14.5",
          "15",
          "15.5",
          "16",
          "16.5",
          "17",
          "17.5",
          "18",
          "18.5",
          "19",
          "19.5",
          "32.5",
          "33",
          "33.5",
          "34",
          "34.5",
          "35",
          "35.5",
          "36",
          "36.5",
          "37",
          "37.5",
          "38",
          "38.5",
          "39",
          "39.5",
          "40",
          "40.5",
          "41",
          "41.5",
          "42",
          "42.5",
          "43",
          "43.5",
          "44",
          "44.5",
          "45",
          "45.5",
          "46",
          "46.5",
          "47",
          "47.5",
          "48",
          "48.5",
          "49",
          "49.5",
          "50",
          "50.5",
          "51",
          "51.5",
          "52",
          "52.5"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "notebooksbilliger Mobile": {
      "name": "Notebooksbilliger",
      "url": "https://www.notebooksbilliger.de",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Wire Transfer",
          "Credit Card"
      ],
      "checkoutModes": [
          "Account",
          "Guest"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "sneakersnstuff": {
      "name": "Sneakersnstuff",
      "url": "https://www.sneakersnstuff.com/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "otto": {
      "name": "Otto",
      "url": "https://www.otto.de",
      "accountSupport": true,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal",
          "Wire Transfer"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "panini": {
      "name": "Panini",
      "url": "https://collectibles.panini.com/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "queue-pass": {
      "name": "Queue Pass",
      "url": "https://default.com",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Queue Pass"
      ],
      "checkoutModes": [
          "Normal",
          "AMD"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "saturn": {
      "name": "Saturn",
      "url": "https://www.saturn.de/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal",
          "Wire Transfer",
          "In-Store Payment"
      ],
      "checkoutModes": [
          "Monitor",
          "ATC"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": false,
      "hasTaxId": true,
      "hasStateId": false,
      "hasStoreId": true
  },
  "scan-uk": {
      "name": "Scan UK",
      "url": "https://www.scan.co.uk",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Delivery",
          "Pick-Up at Bolton"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "shopware": {
      "name": "Shopware",
      "url": "https://defaulturl.com/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "PayPal",
          "Wire Transfer"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  },
  "topps": {
      "name": "Topps",
      "url": "https://www.topps.com",
      "accountSupport": true,
      "isActive": true,
      "paymentModes": [
          "Credit Card"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": true,
      "hasDiscount": true,
      "hasTaxId": false,
      "hasStateId": true,
      "hasStoreId": false
  },
  "yme-universe": {
      "name": "Yme Universe",
      "url": "https://ymeuniverse.com/",
      "accountSupport": false,
      "isActive": true,
      "paymentModes": [
          "Credit Card",
          "PayPal"
      ],
      "checkoutModes": [
          "Normal"
      ],
      "sizes": [
          "Any"
      ],
      "hasQuantity": false,
      "hasDiscount": false,
      "hasTaxId": false,
      "hasStateId": false,
      "hasStoreId": false
  }
};

let sessions = {};

let connections = {};
let perSocketBuffer = {};

initDatabase();

async function initDatabase() {
  await db.init();
}

const server = net.createServer((c) => {
  c.on('end', () => {
    let socketId = c.remoteAddress + ":" + c.remotePort;
    if (connections[socketId] != undefined) {
      console.log(`${c.remoteAddress}:${c.remotePort} disconnected from server`);
      delete connections[socketId];
    }
  });

  c.on('error', (error) => {
    console.error(`error occured: ${error}`);
  });

  c.on('data', (data) => {
    let socketId = c.remoteAddress + ":" + c.remotePort;
    if (perSocketBuffer[socketId] == undefined) {
      perSocketBuffer[socketId] = '';
    }

    perSocketBuffer[socketId] += data;

    if (perSocketBuffer[socketId].includes('<EOF>')) {
      let messages = perSocketBuffer[socketId].split('<EOF>');
      handleMessage(c, messages[0]);
      perSocketBuffer[socketId] = messages[1];
    }
  });

  // console.log(`${c.remoteAddress}:${c.remotePort} connected to server`);
});

server.on('error', (err) => {
  throw err;
});

server.listen(8124, () => {
  console.log('server started!');

  // setInterval(() => {
  //   let data = {};
  //   data["event"] = "close";

  //   let request = {};
  //   request["id"] = Math.floor(Math.random() * (99999 - 50000 + 1) + 50000);
  //   request["data"] = data;

  //   console.log('try sending close event');
  //   if (connections[Object.keys(connections)[0]] != undefined) {
  //     connections[Object.keys(connections)[0]].write(formatResponse(JSON.stringify(request)));
  //     console.log('sent close event');
  //   }
  // }, 15000);
});

const CLIENT_ACTION_MIN = 1;
const CLIENT_ACTION_MAX = 49999;
const CLIENT_RESPONSE_MIN = 50000;
const CLIENT_RESPONSE_MAX = 99999;

function handleMessage(c, message) {
  try {
    console.log(`\n\n----- Received Message -----\n${message}\n----------------------------`);
    
    message = JSON.parse(message);

    const id = parseInt(message['id']);

    if (id >= CLIENT_ACTION_MIN && id <= CLIENT_ACTION_MAX) {
      // handle action
      handleAction(c, message);
    }
    else if (id >= CLIENT_RESPONSE_MIN && id <= CLIENT_RESPONSE_MAX) {
      // handle status
      handleStatus(c, message);
    }
    else {
      console.log('Operation not supported!');
    }
  }
  catch (error) {
    console.log(error);
  }
}

async function addSuccess(license, info) {
  let obj = {
    license: license,
    status: 'success',
    site: info['site'],
    productId: info['productId'],
    checkoutMode: info['checkoutMode'],
    paymentMode: info['paymentMode'],
    price: info['price']
  }
  await db.addSuccess(db.client, obj);
}

async function addFailure(license, info) {
  let obj = {
    license: license,
    status: 'failure',
    site: info['site'],
    productId: info['productId'],
    checkoutMode: info['checkoutMode'],
    paymentMode: info['paymentMode'],
    price: info['price']
  }
  await db.addFailure(db.client, obj);
}

function handleSuccess(c, message) {
  let response = {};
  response['id'] = message['id'];
  response['status'] = 'success';
  response['data'] = {};

  if (sessions[message['data']['session']] !== undefined) {
    addSuccess(sessions[message['data']['session']].license, message['data']);
  }
  else {
    response['status'] = 'error';
    response['message'] = 'Session does not exist';
  }

  console.log(`----- Sending Response -----\n[${c.remoteAddress}:${c.remotePort}]`);
  let res = formatResponse(JSON.stringify(response))
  c.write(res);
  console.log(`----------------------------`);
  return;
}

function handleFailure(c, message) {
  let response = {};
  response['id'] = message['id'];
  response['status'] = 'success';
  response['data'] = {};

  if (sessions[message['data']['session']] !== undefined) {
    addFailure(sessions[message['data']['session']].license, message['data']);
  }
  else {
    response['status'] = 'error';
    response['message'] = 'Session does not exist';
  }

  console.log(`----- Sending Response -----\n[${c.remoteAddress}:${c.remotePort}]`);
  let res = formatResponse(JSON.stringify(response))
  c.write(res);
  console.log(`----------------------------`);
  return;
}

function handleAction(c, message) {
  const event = message['data']['event'];

  switch (event) {
    case 'success':
      handleSuccess(c, message);
      break;
    case 'failure':
      handleFailure(c, message);
      break;
    case 'session': 
    case 'heartbeat':
      handleHeartbeat(c, message);
      break;
    default:
      console.log(`Client [${c.remoteAddress}:${c.remotePort}] requested unsupported action: ${event}`);
  }
}

async function handleHeartbeat(c, message) {
  let socketId = c.remoteAddress + ":" + c.remotePort;

  if (connections[socketId] == undefined) {
    console.log(`${c.remoteAddress}:${c.remotePort} connected to server`);
    connections[socketId] = c;
  }

  let response = {};
  response['id'] = message['id'];
  response['status'] = 'success';
  response['data'] = {
    version: version
  };

  // first heartbeat from a new connection will contain license instead of session
  if ('license' in message['data']) {
    try {
      // check license with TLdashboard api
      var AWS = require('aws-sdk');
      
        AWS.config.update({
        region: "us-east-1",
        accessKeyId: "",
        secretAccessKey: ""
        });

      var ssmClient = new AWS.SSM(
        {
          region: 'us-east-1'
        }
      );
      let password;
      var params = {
        Name: 'CREDENTIALS', 
        WithDecryption: false
      };
      ssmClient.getParameter(params, function(err, data) {
        if (err) password = err; 
        else     password = data.Parameter;           
      });
     
      let fetchRes = await fetch(`https://api.tldashboards.com/v1/user?licenseKey=${message['data']['license']}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${process.env.CREDENTIALS}`
            // 'Authorization': `Basic ${password}`
        }
      });

      if (fetchRes.status == 200) {
        let jsonRes = await fetchRes.json();
        if (jsonRes.userStatus === "Active" || jsonRes.userStatus === 'Paused') {
          let uuid = uuidv4();
          response['data']['license'] = 'valid'
          response['data']['session'] = uuid;

          sessions[uuid] = {
            'license': message['data']['license'],
            'valid': true
          };

          // get analytics from db
          let success = await db.findSuccess(db.client, message['data']['license']);
          let failure = await db.findFailure(db.client, message['data']['license']);

          response.data.userInfo = jsonRes;
          response.data.stores = stores;
          response.data.analytics = {
            successful: success.length,
            failed: failure.length,
            total: success.length + failure.length
          }
        }
        else {
          response['data']['license'] = 'expired';
          response['data']['message'] = 'The license key is expired or cancelled, please check your status.';
        }
      }
      else if (fetchRes.status == 404) {
        response['data']['license'] = 'invalid';
        response['data']['message'] = 'Invalid license key.';
      }
      else if (fetchRes.status == 500) {
        response['data']['license'] = 'error';
        response['data']['message'] = 'Error while validating license. Server error occured.';
      }
      else {
        response['data']['license'] = 'error';
        response['data']['message'] = 'Error while validating license. Server error occured. Response status: ' + fetchRes.status +password;
      }
    }
    catch (error) {
      response['status'] = 'error';
      response['message'] = 'Error while validating license. Server error occured: ' + error;
    }
  }
  else {
    try {
      if (sessions[message['data']['session']] !== undefined) {
        // check license with TLdashboard api
        let fetchRes = await fetch(`https://api.tldashboards.com/v1/user?licenseKey=${sessions[message['data']['session']].license}`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${process.env.CREDENTIALS}`
          }
        });

        if (fetchRes.status == 200) {
          let jsonRes = await fetchRes.json();
          if (jsonRes.userStatus === "Active" || jsonRes.userStatus === 'Paused') {
            response['data']['session'] = 'valid';

            // get analytics from db
            let success = await db.findSuccess(db.client, sessions[message['data']['session']].license);
            let failure = await db.findFailure(db.client, sessions[message['data']['session']].license);

            response.data.userInfo = jsonRes;
            response.data.stores = stores;
            response.data.analytics = {
              successful: success.length,
              failed: failure.length,
              total: success.length + failure.length
            }
          }
          else {
            response['data']['session'] = 'expired';
            response['data']['message'] = 'The license key is expired or cancelled, please check your status.';
          }
        }
        else if (fetchRes.status == 404) {
          response['data']['session'] = 'invalid';
          response['data']['message'] = 'Invalid license key.';
        }
        else if (fetchRes.status == 500) {
          response['data']['session'] = 'error';
          response['data']['message'] = 'Error while validating license. Server error occured.';
        }
        else {
          response['data']['session'] = 'error';
          response['data']['message'] = 'Error while validating license. Server error occured. Response status: ' + fetchRes.status;
        }
      }
      else {
        response['data']['session'] = 'invalid';
        response['data']['message'] = 'Session invalid';
      }
    }
    catch (error) {
      response['status'] = 'error';
      response['message'] = 'Error while validating license. Server error occured: ' + error;
    }
  }

  console.log(`----- Sending Response -----\n[${c.remoteAddress}:${c.remotePort}]`);
  let res = formatResponse(JSON.stringify(response))
  c.write(res);
  console.log(`----------------------------`);
  return;
}

function handleStatus(c, message) {
  const status = message['status'];
  const prefix = `Client [${c.remoteAddress}:${c.remotePort}] returned status: ${status}`;

  switch (status) {
    case 'success':
    case 'fail':
      console.log(`${prefix} | data: ${message['data']}`);
      break;
    case 'error':
      console.log(`${prefix} message: ${message['message']} | code: ${message['code']} | data: ${message['data']}`);
      break;
    default:
      console.log(`Client [${c.remoteAddress}:${c.remotePort}] returned status invalid status: ${status}`);
  }
}

function formatResponse(data) {
  // data is supposed to be a string
  return data + "<EOF>";
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

