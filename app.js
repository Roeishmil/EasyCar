const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const {getOrderCountByDateForThisWeek, insertData, IsInDatabase, insertToDataBase, getCurrentStockFromDatabase, updateDataBase , findDataByUsername , getAllUsers,deleteEntry , getFromDataBase, } = require('./database/database'); // catching from database.js the function

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
      const user = await IsInDatabase(loginInfo, 'users','login');  // Check if user exists in the 'users' collection
      if (user) {
          res.json({ success: true, isAdmin: user.isAdmin });  // Send success response with user's level
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
      year: parseInt(year),
      mileage: parseInt(mileage),
      price: parseInt(price),
      description: description,
      manufacturer: manufacturer,
      quantity: parseInt(quantity),
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
      const {query} = req.body;
      const cars = await getCurrentStockFromDatabase(query); // Call to database.js to fetch cars
      res.json({ success: true, data: cars });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch cars', error: error.message });
  }
});

app.post('/processOrder', async (req, res) => {
  const { username , items } = req.body;
    console.log(items);

    // TO-DO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! make it so two identicak items will remove the amount from the quantity

    // Apply updateDataBase for each item in the items array
    items.forEach((item) => {    
    let query = {name: item.name };
    let quantity = parseInt(item.quantity) - 1;
    let newVal = { $set: {quantity: quantity}};
    updateDataBase(query, newVal, 'products');  // Call the updateDataBase function for each item
    });
    
  try {
    const order = {
      username: username,
      items: items,
      createdAt: new Date() //Add timestamp for creation
    }
    const result = await insertToDataBase(order, 'orders');
    res.json({ success: result });
} catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process order', error: error.message });
}
});

app.post('/getOrdersByUser', async (req, res) => {
  const { currentUser } = req.body;
try{
    
    const orders = await findDataByUsername(currentUser,'orders');
    console.log(orders);
    res.json(orders);
} catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process order', error: error.message });
}
});

app.post('/getUsers', async (req, res) => {
  try {
    const users = await getAllUsers(); //get all users
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.post('/deleteEntry', async (req, res) => {
  try {
    const { deletionEntry } = req.body;
    const result = await deleteEntry(deletionEntry,'users'); //Delete one entry
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry' });
  }
});

app.post('/updateUser', async (req, res) => {
  try {
    const { username , newIsAdmin } = req.body;
    let query = { username: username };
    let newVal = { $set: {isAdmin: newIsAdmin}};
    const result = await updateDataBase(query, newVal, 'users');  // Call the updateDataBase function for this user
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry' });
  }
});

app.post('/getAllOrders', async (req, res) => {
  try {
    
    const orders = await getFromDataBase(null,'orders');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});


app.post('/searchForProducts', async (req, res) => {
  try {
    const { name, manufacturer, priceOperator, price } = req.body;
    
    let query = {};

    query.quantity = {$gt: 0};
    if (name) query.name = name;
    if (manufacturer) query.manufacturer = manufacturer;
    
    if (price && priceOperator) {
      const priceCondition = priceOperator === 'ge' ? { $gte: parseFloat(price) } : { $lte: parseFloat(price) };
      query.price = priceCondition;
    }

    const products = await getFromDataBase(query,'products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

app.post('/getOrderCountByDate', async (req, res) => {
  try {
      const result = await getOrderCountByDateForThisWeek();
      res.json(result);
  } catch (error) {
      console.error('Error fetching order count:', error);
      res.status(500).json({ message: 'Error fetching order count' });
  }
});


// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});