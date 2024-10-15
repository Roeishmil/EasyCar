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

// Function to insert data -- may need to be deleted!
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

async function updateDataBase(query, newvalues, collectionName) {
  try {
    const collection = db.collection(collectionName); // Reference to the collection
    const result = await collection.updateOne(query, newvalues);
    return result;
  } catch (err) {
    console.error('Failed to update data', err);
    throw err;
  }
}

async function getFromDataBase(query,collectionName) {
  try {
    const collection = db.collection(collectionName); // Reference to the collection
    let result;
    if(query){
     result = await collection.find(query).toArray();
    }
    else{
     result = await collection.find().toArray();
    }
    return result;
  } catch (err) {
    console.error('Failed to find data', err);
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
async function getCurrentStockFromDatabase(query) {
  try {
      const collection = db.collection('products'); // Assuming the collection is 'products'
      const cars = await collection.find(query).toArray(); // Fetch all documents (cars)
      return cars;
  } catch (err) {
      console.error('Failed to fetch cars', err);
      throw err;
  }
}

// Function to get all cars from the 'products' collection
async function findDataByUsername(currentUser ,collectionName) {
  try {
      const collection = db.collection(collectionName); 
      const dataOfUser = await collection.find({ username : currentUser }).toArray(); // Fetch all documents
      return dataOfUser;
  
  } catch (err) {
      console.error('Failed to fetch userData', err);
      throw err;
  }
}

// Function to get all users
async function getAllUsers() {
  try {
      const users = await db.collection('users').find().toArray();
      return users;
  
  } catch (err) {
      console.error('Failed to fetch userData', err);
      throw err;
  }
}

async function getOrderCountByDate() {
  try {
    // Get the current date
    const today = new Date();
    
    // Calculate the start of the current week (Monday)
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() - 5)); // Adjust for current week's Monday
    firstDayOfWeek.setHours(0, 0, 0, 0); // Set time to the start of the day
    
    // Calculate the end of the current week (Sunday)
    const lastDayOfWeek = new Date(today.setDate(firstDayOfWeek.getDate() + 7));
    lastDayOfWeek.setHours(23, 59, 59, 999); // Set time to the end of the day

    const result = db.collection('orders').aggregate([
      {
        // Match orders created within the current week
        $match: {
          createdAt: {
            $gte: firstDayOfWeek, // Greater than or equal to the start of the week
            $lte: lastDayOfWeek   // Less than or equal to the end of the week
          }
        }
      },
      {

        // Convert the createdAt field to only contain the date part (ignore time)
        $project: {
          date: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          }
        }
      },
      {
        // Group by the formatted date and count the number of orders
        $group: {
          _id: "$date",
          count: { $sum: 1 }
        }
      },
      {
        // sort by date (ascending)
        $sort: { _id: 1 }
      }
    ]).toArray();
      return result;
  
  } catch (err) {
      console.error('Failed to delete entry', err);
      throw err;
  }
}

// Function to delete an entry
async function deleteEntry( deletionEntry, collectionName ) {
  try {
      console.log(deletionEntry);
      const result = await db.collection(collectionName).deleteOne({username: deletionEntry});
      return result;
  
  } catch (err) {
      console.error('Failed to delete entry', err);
      throw err;
  }
}

module.exports = {getOrderCountByDate, insertData, IsInDatabase, insertToDataBase, getCurrentStockFromDatabase, updateDataBase, findDataByUsername , getAllUsers , deleteEntry, getFromDataBase};
  // Exporting functions