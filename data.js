// data.js
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const DATABASE_FILE = "data.sqlite";

async function initializeDatabase() {
  return sqlite.open({
    filename: DATABASE_FILE,
    driver: sqlite3.Database,
  });
}

const dbPromise = initializeDatabase();

module.exports = {
  dbPromise,
};
