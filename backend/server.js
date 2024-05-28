const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Enable CORS and body parsing middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

// MongoDB connection string from environment variables
const uri = process.env.MONGODB_URI;

// Create a new MongoClient with the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB and return the database instance
async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    return client.db('Ai-Image-DB');
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

let db;
connectToDB().then(database => {
  db = database;
});

// API endpoint to save a generated image and its description to MongoDB
app.post('/api/save-image', async (req, res) => {
  try {
    const { image, description } = req.body;
    const imagesCollection = db.collection('images');
    const result = await imagesCollection.insertOne({ image, description });
    res.status(201).json({ message: 'Image saved successfully', result });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// API endpoint to fetch the 5 most recent searches from MongoDB
app.get('/api/recent-searches', async (req, res) => {
  try {
    const imagesCollection = db.collection('images');
    const recentImages = await imagesCollection.find().sort({ _id: -1 }).limit(5).toArray();
    res.status(200).json(recentImages);
  } catch (error) {
    console.error("Error fetching recent searches:", error);
    res.status(500).json({ error: 'Failed to fetch recent searches' });
  }
});

// Start the Express server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
