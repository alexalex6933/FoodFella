const cassandra = require('cassandra-driver');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

// Determine the secure connect bundle path based on environment
let secureConnectPath = process.env.ASTRA_SECURE_CONNECT_PATH;

// For Render deployment, check if the bundle is in the mounted disk
if (process.env.NODE_ENV === 'production') {
  const renderPath = '/opt/render/project/src/secure-connect/secure-connect-foodfella.zip';
  if (fs.existsSync(renderPath)) {
    secureConnectPath = renderPath;
    console.log('Using Render mounted secure connect bundle');
  }
}

// Cassandra client configuration for Astra DB
const client = new cassandra.Client({
  cloud: {
    secureConnectBundle: secureConnectPath,
  },
  credentials: {
    username: process.env.CASSANDRA_USERNAME,
    password: process.env.CASSANDRA_PASSWORD,
  },
  keyspace: process.env.CASSANDRA_KEYSPACE,
});

// Connect to the database
const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to DataStax Astra DB');
    
    // Create tables if they don't exist
    await createTablesIfNotExist();
    
    return client;
  } catch (error) {
    console.error('Error connecting to Astra DB:', error);
    process.exit(1);
  }
};

// Create tables if they don't exist
const createTablesIfNotExist = async () => {
  try {
    // Users table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY,
        email text,
        password text,
        first_name text,
        last_name text,
        role text,
        created_at timestamp,
        updated_at timestamp
      );
    `);
    
    // Create index on email for user lookup
    await client.execute(`
      CREATE INDEX IF NOT EXISTS ON users (email);
    `);
    
    // Restaurants table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id uuid PRIMARY KEY,
        name text,
        description text,
        cuisine_type text,
        price_range text,
        merchant_id uuid,
        created_at timestamp,
        updated_at timestamp
      );
    `);
    
    // Create index on merchant_id for restaurant lookup
    await client.execute(`
      CREATE INDEX IF NOT EXISTS ON restaurants (merchant_id);
    `);
    
    // Restaurant locations table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS restaurant_locations (
        restaurant_id uuid,
        location_id uuid,
        address text,
        city text,
        state text,
        zip_code text,
        latitude double,
        longitude double,
        created_at timestamp,
        updated_at timestamp,
        PRIMARY KEY (restaurant_id, location_id)
      );
    `);
    
    // Restaurant images table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS restaurant_images (
        restaurant_id uuid,
        image_id uuid,
        image_url text,
        is_primary boolean,
        created_at timestamp,
        updated_at timestamp,
        PRIMARY KEY (restaurant_id, image_id)
      );
    `);
    
    // Reviews table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        restaurant_id uuid,
        user_id uuid,
        review_id uuid,
        rating int,
        comment text,
        created_at timestamp,
        updated_at timestamp,
        PRIMARY KEY ((restaurant_id), review_id)
      );
    `);
    
    // Create index on user_id for review lookup
    await client.execute(`
      CREATE INDEX IF NOT EXISTS ON reviews (user_id);
    `);
    
    // Restaurant by cuisine table for search
    await client.execute(`
      CREATE TABLE IF NOT EXISTS restaurants_by_cuisine (
        cuisine_type text,
        restaurant_id uuid,
        name text,
        price_range text,
        created_at timestamp,
        PRIMARY KEY (cuisine_type, restaurant_id)
      );
    `);
    
    // Restaurant by location table for search
    await client.execute(`
      CREATE TABLE IF NOT EXISTS restaurants_by_location (
        city text,
        restaurant_id uuid,
        name text,
        cuisine_type text,
        price_range text,
        created_at timestamp,
        PRIMARY KEY (city, restaurant_id)
      );
    `);
    
    // Restaurant descriptions vector table for semantic search
    await client.execute(`
      CREATE TABLE IF NOT EXISTS restaurant_vectors (
        id uuid PRIMARY KEY,
        restaurant_id uuid,
        description_vector VECTOR<float, 1536>,
        created_at timestamp
      );
    `);
    
    // Create index on description_vector for ANN search
    await client.execute(`
      CREATE CUSTOM INDEX IF NOT EXISTS ON restaurant_vectors (description_vector) 
      USING 'StorageAttachedIndex' 
      WITH OPTIONS = {
        'similarity_function': 'cosine'
      };
    `);
    
    console.log('All tables created or already exist');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

module.exports = {
  client,
  connectDB,
}; 