const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { insertData } = require('./database/database'); // catching from database.js the function

app.use(bodyParser.json());

//this reffers to the public folder which we keep in the HTML/js files
app.use(express.static('public'));

// API route to handle data insertion
app.post('/insert', async (req, res) => {
  const data = req.body;  // Get data from the request body

  try {
    const result = await insertData(data);  // Insert data into MongoDB
    res.json({ success: true, insertedId: result.insertedId });
    console.log("insertion");
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to insert data' });
  }
});

// Start the server
app.listen(3000,()=>{console.log("server running on 3000");});