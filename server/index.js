const express = require('express');
const app = express();

// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.static('public'));

// Setup the database connection container
let database = null;

// Add the database connection to the request
app.use(async (req, res, next) => {
  req.database = database;
  next();
});

// Add the routes
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

// Start the server
app.listen(process.env.PORT, async () => {
  // Connect to the database (MongoDB)
  const dbClient = require('./services/database');
  database = (await dbClient.connectToCluster()).db('blog');

  // Log the port
  console.log(`Server listening on port ${process.env.PORT}`);
});
