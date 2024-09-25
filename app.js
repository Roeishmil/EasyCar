const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { insertData, IsInDatabase, insertToDataBase, getCurrentStockFromDatabase } = require('./database/database'); // catching from database.js the function
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//this reffers to the public folder which we keep in the HTML/js files
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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


app.post('/validateLogin', async (req, res) => { //TODO - Hash and encrypt the input
  const loginInfo = req.body;  // Get the username and password from the request body

  try {
      console.log('Login validation'); //Testing
      const user = await IsInDatabase(loginInfo, 'users','login');  // Check if user exists in the 'users' collection
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

app.post('/signupUser', async (req, res) => { //TODO - Hash and encrypt the input
  const signupInfo = req.body;  // Get the username and password from the request body

  try {
      console.log('Signup validation'); //Testing
      const user = await IsInDatabase(signupInfo, 'users','signup');  // Check if user exists in the 'users' collection
      if (user) {
          res.json({ success: false, message:"User already exsit"});  // Send success response with user's level
      } else {
          const result=await insertToDataBase(signupInfo,"users");
          if(result){
            res.json({ success: true, message:"User added succesfully"});
          }
          else{
            res.json({success:false, message:"Failed to add user"});
          }
      }
  } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/addProduct', async (req, res) => {
  const { name, year, mileage, price, description, manufacturer, quantity, image } = req.body; //Copy fields from input to variables

  try {

    const newProduct = {
      name: name,
      year: year,
      mileage: mileage,
      price: price,
      description: description,
      manufacturer: manufacturer,
      quantity: quantity,
      image: image,
      createdAt: new Date(), //Add timestamp for creation
      updatedAt: new Date()
    };
  
    const result = await insertToDataBase(newProduct,"products"); // Save the product to MongoDB
    

    if(result){
      fetchCars(); // Fetch and display the updated car list
      modal.style.display = "none"; // Close the modal
      res.json({ success: true, message:"Product added succesfully"});
    }
    else{
      res.json({success:false, message:"Failed to add product on server side"});
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.post('/getCurrentStock', async (req, res) => {
  try {
      const cars = await getCurrentStockFromDatabase(); // Call to database.js to fetch cars
      res.json({ success: true, data: cars });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch cars', error: error.message });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});