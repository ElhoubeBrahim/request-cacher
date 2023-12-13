const axios = require('axios');
const express = require('express');
const app = express();

// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config();

// Get the redis client and the cache middleware
const client = require('./services/cache');
const checkCache = require('./middlewares/cache');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.static('public'));

app.use(checkCache, async (req, res) => {
  // Get the target endpoint
  const endpoint = req.path;
  let response = null;

  // Make the request to the server
  try {
    response = await axios.get(`${process.env.SERVER_URL}${endpoint}`)
  } catch (error) {
    response = error.response;
  }

  // Create the response object
  response = response != null
    ? { status: response.status, data: response.data }
    : { status: 500, data: 'Something went wrong'}

  // Cache the response for 5 minutes
  client.set(endpoint, JSON.stringify(response), {
    EX: 300, // TTL in seconds
  });

  // Send the response
  res.status(response.status).send(response.data)
});

// Start the proxy server
app.listen(process.env.PORT, async () => {
  await client.connect();
  console.log(`Proxy server listening on port ${process.env.PORT}`);
});
