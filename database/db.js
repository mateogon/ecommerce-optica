const { Client } = require("pg");

// Function to connect to the database
async function connectToDatabase() {
  const client = new Client();
  await client.connect();
  console.log("Connected to the database");
  return client;
}

// Function to execute a query
async function executeQuery(query) {
  const client = await connectToDatabase();
  const result = await client.query(query);
  client.end();
  return result.rows;
}

module.exports = {
  connectToDatabase,
  executeQuery,
};
