const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS middleware
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',        
  user: 'root',             
  password: 'Malindatha@619',     
  database: 'crowdfunding_db' 
});

// Connect to MySQL
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

// Get all active fundraisers
app.get('/fundraisers', (req, res) => {
  const query = `SELECT F.*, C.NAME as CATEGORY_NAME
                 FROM FUNDRAISER F
                 JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
                 WHERE ACTIVE = TRUE`;

  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get fundraiser by ID
app.get('/fundraiser/:id', (req, res) => {
  const query = `SELECT F.*, C.NAME as CATEGORY_NAME
                 FROM FUNDRAISER F
                 JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
                 WHERE F.FUNDRAISER_ID = ?`;

  connection.query(query, [req.params.id], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Search fundraisers based on organizer, city, or category
app.get('/fundraisers/search', (req, res) => {
  const { organizer, city, category } = req.query;

  let query = `SELECT F.*, C.NAME as CATEGORY_NAME
               FROM FUNDRAISER F
               JOIN CATEGORY C ON F.CATEGORY_ID = C.CATEGORY_ID
               WHERE ACTIVE = TRUE`;

  // Add filters if they are provided
  const filters = [];
  if (organizer) filters.push(`F.ORGANIZER LIKE '%${organizer}%'`);
  if (city) filters.push(`F.CITY LIKE '%${city}%'`);
  if (category) filters.push(`C.NAME LIKE '%${category}%'`);
  
  if (filters.length > 0) {
    query += ' AND ' + filters.join(' AND ');
  }

  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
