const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./alerts.db', (err) => {
  if (err) {
    console.error("Could not connect to SQLite database:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create alerts table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    latitude REAL,
    longitude REAL,
    description TEXT,
    nearestnode INTEGER,
    nodeweight INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("Error creating alerts table:", err);
  }
});


module.exports = db;