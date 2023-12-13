const MongoClient = require('mongodb').MongoClient;

/**
 * Connects to the MongoDB cluster and returns the client.
 * 
 * @returns {Promise<MongoClient>}
 */
module.exports.connectToCluster = async () => {
  const database_uri = process.env.DB_URI;
  let mongoClient;

  try {
    mongoClient = new MongoClient(database_uri);
    await mongoClient.connect();
    console.log('Successfully connected to MongoDB Atlas!');

    return mongoClient;
  } catch (error) {
    console.error('Connection to MongoDB Atlas failed!', error);
    process.exit();
  }
}
