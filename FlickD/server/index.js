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

const uri = "mongodb+srv://test_user:mypassword1@cluster0.ddewxiq.mongodb.net/flickD?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

let usersCollection;

async function connectDB() {
  await client.connect();
  const db = client.db('flickD');
  usersCollection = db.collection('users');
  // Removed createIndex for compatibility
}
connectDB();

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  console.log('Signup endpoint hit');
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ name, email, password: hashedPassword });
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
  const token = jwt.sign({ email: user.email, name: user.name }, 'your_jwt_secret', { expiresIn: '1h' });
  res.json({ token });
});

const PORT = process.env.PORT || 4000;
app.listen(4000, '0.0.0.0', () => {
  console.log('Server running on port 4000');
});