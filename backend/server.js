require('dotenv').config();
const express = require('express');
const db = require('./db');
const app = express();

// Parse incoming JSON requests
app.use(express.json());

// Use environment variable PORT or default to 3000
const PORT = process.env.PORT || 3000;

// POST endpoint to receive emergency alerts
app.post('/alert', (req, res) => {
  const { latitude, longitude, description, nearestnode, nodeweight } = req.body;

  console.log(`Received alert at [${latitude}, ${longitude}] with description: "${description}" and nearestnode: ${nearestnode}`);

  // Check for an existing identical alert
  const checkQuery = `
    SELECT id FROM alerts
    WHERE latitude = ? AND longitude = ? AND description = ? AND nearestnode = ? AND nodeweight = ?
  `;
  db.get(checkQuery, [latitude, longitude, description, nearestnode, nodeweight], (err, row) => {
    if (err) {
      console.error("Error checking for duplicate alert:", err);
      return res.status(500).json({ message: "Internal error" });
    }
    if (row) {
      console.log("Duplicate alert detected with id:", row.id);
      return res.status(200).json({ message: "Duplicate alert ignored", alertId: row.id });
    } else {
      // Insert alert into the database
      const insertQuery = `
        INSERT INTO alerts (latitude, longitude, description, nearestnode, nodeweight)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(insertQuery, [latitude, longitude, description, nearestnode, nodeweight], function(err) {
        if (err) {
          console.error("Error inserting alert:", err);
          return res.status(500).json({ message: 'Failed to insert alert' });
        }
        // Optionally, run ML model on the description here
        res.status(200).json({ message: 'Alert received successfully', alertId: this.lastID });
      });
    }
  });
});

// GET endpoint to retrieve alerts (ordered by most recent)
app.get('/alerts', (_req, res) => {
  const selectQuery = `
    SELECT * FROM alerts
    ORDER BY created_at DESC
  `;
  db.all(selectQuery, (err, rows) => {
    if (err) {
      console.error("Error retrieving alerts:", err);
      return res.status(500).json({ message: 'Failed to retrieve alerts' });
    }
    res.status(200).json({ alerts: rows });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});