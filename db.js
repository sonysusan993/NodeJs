const { MongoClient } = require('mongodb');

let db = {};

db.init = async function main() {
  const uri = "mongodb+srv://nullreference:9c183QJbzbWzK2aQ@cluster0.grmsp.mongodb.net/carnagebot?retryWrites=true&w=majority";

  let client = new MongoClient(uri);
  db.client = client;

  try {
    await client.connect();
  }
  catch (e) {
      console.error(e);
  }
}

db.listDatabases = async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

db.addSuccess = async function addSuccess(client, obj) {
  await client.db('carnagebot').collection('analytics').insertOne(obj);
  console.log('Inserted 1 success');
}

db.addFailure = async function addFailure(client, obj) {
  await client.db('carnagebot').collection('analytics').insertOne(obj);
  console.log('Inserted 1 failure');
}

db.findSuccess = async function findSuccess(client, license) {
  let res = await client.db('carnagebot').collection('analytics').find({ license: license, status: 'success' });
  res = await res.toArray();
  return res;
}

db.findFailure = async function findFailure(client, license) {
  let res = await client.db('carnagebot').collection('analytics').find({ license: license, status: 'failure' });
  res = await res.toArray();
  return res;
}

db.close = async function close(client) {
  await client.close();
}

module.exports.db = db;