const { Client } = require("pg");

// Function to connect to the database
async function connectToDatabase() {
  const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "optica",
    password: "password",
    port: 5432,
  });

  await client.connect();
  console.log("Connected to the database");
  return client;
}

// Function to execute a query
async function executeQuery(query) {
  const client = await connectToDatabase();
  try {
    const result = await client.query(query);
    return result.rows;
  } finally {
    client.end();
  }
}

module.exports = {
  connectToDatabase,
  executeQuery,
};
