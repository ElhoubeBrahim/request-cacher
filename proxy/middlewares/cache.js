const client = require('../services/cache');

/**
 * Middleware that checks if the endpoint is cached.
 */
module.exports = async (req, res, next) => {
  // Get the target endpoint
  const endpoint = req.path;
  let response = await client.get(endpoint);

  // If the endpoint is cached, send the response
  if (response != null) {
    console.log('Cache hit');
    response = JSON.parse(response);
    return res.status(response.status).send(response.data);
  }

  // Otherwise, make the request to the server ...
  next();
};