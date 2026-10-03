const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let db = null;

async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log("✅ Conectado a MongoDB - BD:", process.env.DB_NAME);
  return db;
}

function getDB() {
  if (!db) throw new Error("La base de datos no está conectada");
  return db;
}

module.exports = { connectDB, getDB };