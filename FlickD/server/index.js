const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

const uri = "mongodb://test_user:testuser__1@atlas-sql-6837491fb7eddf3deab780ea-druplg.a.query.mongodb.net:27017/sample_mflix?ssl=true&authSource=admin";
const client = new MongoClient(uri);

let usersCollection;

async function connectDB() {
  await client.connect();
  const db = client.db('sample_mflix');
  usersCollection = db.collection('users');
}
connectDB();

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  console.log('Signup endpoint hit');
  const { email, password } = req.body;
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ email, password: hashedPassword });
  res.json({ message: 'User created' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await usersCollection.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  // Generate JWT token
  const token = jwt.sign({ email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 