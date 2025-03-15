const { createClient } = require('@astrajs/rest');
const dotenv = require('dotenv');

dotenv.config();

// Create an Astra DB REST client
const connectDB = async () => {
  try {
    const astraClient = await createClient({
      astraDatabaseId: process.env.ASTRA_DB_ID,
      astraDatabaseRegion: process.env.ASTRA_DB_REGION,
      applicationToken: process.env.CASSANDRA_USERNAME,
    });
    
    console.log('Connected to DataStax Astra DB via REST API');
    
    return astraClient;
  } catch (error) {
    console.error('Error connecting to Astra DB:', error);
    process.exit(1);
  }
};

// Get a collection reference
const getCollection = async (collectionName) => {
  const client = await connectDB();
  return client.namespace(process.env.CASSANDRA_KEYSPACE).collection(collectionName);
};

module.exports = {
  connectDB,
  getCollection
}; 