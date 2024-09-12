const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { insertData, IsInDatabase } = require('./database/database'); // catching from database.js the function

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

app.post('/validateLogin', async (req, res) => {
  const loginInfo = req.body;  // Get the username and password from the request body

  try {
      const user = await IsInDatabase(loginInfo, 'users');  // Check if user exists in the 'users' collection
      if (user) {
          res.json({ success: true, level: user.level });  // Send success response with user's level
      } else {
          res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});