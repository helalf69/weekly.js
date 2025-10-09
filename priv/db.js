const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Fila weekly.db ligger i samme mappe som denne fila
const DB_FILE = path.join(__dirname, 'weekly.db');

// Opprett / åpne database
const db = new sqlite3.Database(DB_FILE);

// Promise-wrappere (for await/async)
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });
}

async function init() {
  await run(`
    CREATE TABLE IF NOT EXISTS User (
      IDuser INTEGER PRIMARY KEY AUTOINCREMENT,
      Uname TEXT UNIQUE NOT NULL,
      Upassword TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('SQLite-tabellen User klar.');
}

module.exports = { db, run, get, init };