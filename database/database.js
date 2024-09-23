const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

// MongoDB connection URI and database name
const uri = 'mongodb+srv://roei159963:3akHuZrNcA83MyPo@cluster0.1ymzk.mongodb.net/';
const dbName = 'testdb';
const client = new MongoClient(uri);

// MongoDB Atlas connection
let db;
async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log('Connected to MongoDB');
      
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

//start the connection to the database
connectToMongoDB();

// Function to insert data
async function insertData(data) {
    try {
      const collection = db.collection('orders'); // collection name
      const result = await collection.insertOne(data);
      return result;
    } catch (err) {
      console.error('Failed to insert data', err);
      throw err;
    }
  }

// Function to check if user exists in the database
async function IsInDatabase(inputData, collectionName,Type) {
  let user;
  try {
      const collection = db.collection(collectionName);
      switch(Type) {
        case 'login':
          user = await collection.findOne({ username: inputData.username, password: inputData.password });  
          break;

        case 'signup':
          user = await collection.findOne({ username: inputData.username}); 
          break;
      }
      if(user){
      console.log('Match found',user);
      }
      return user;  // Return the user document if found
  } catch (err) {
      console.error('Error finding user in database', err);
      throw err;
  }
}

async function insertToDataBase(data,collectionName) {
  try {
    const collection = db.collection(collectionName); // Reference to the 'users' collection
    const result = await collection.insertOne(data);
    return result;
  } catch (err) {
    console.error('Failed to insert data', err);
    throw err;
  }
}

// Function to get all cars from the 'products' collection
async function getCurrentStockFromDatabase() {
  try {
    console.log('get car database.js');
      const collection = db.collection('products'); // Assuming the collection is 'products'
      const cars = await collection.find({}).toArray(); // Fetch all documents (cars)
      console.log(cars);
      return cars;
  } catch (err) {
      console.error('Failed to fetch cars', err);
      throw err;
  }
}

module.exports = { insertData, IsInDatabase, insertToDataBase, getCurrentStockFromDatabase};  // Exporting functions