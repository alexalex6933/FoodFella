# FoodFella Backend

Backend API for the FoodFella food delivery application using DataStax Cassandra.

## Features

- User authentication (register, login, profile management)
- Restaurant management (CRUD operations)
- Review system
- Search functionality (by cuisine, location, rating, price range)
- Role-based access control (customer and merchant roles)

## Tech Stack

- Node.js
- Express.js
- DataStax Cassandra
- JWT for authentication
- bcrypt for password hashing

## Prerequisites

- Node.js (v14 or higher)
- Apache Cassandra or DataStax Astra DB

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/foodfella-backend.git
   cd foodfella-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   
   # DataStax Cassandra Configuration
   CASSANDRA_CONTACT_POINTS=127.0.0.1
   CASSANDRA_DATACENTER=datacenter1
   CASSANDRA_KEYSPACE=foodfella
   CASSANDRA_USERNAME=
   CASSANDRA_PASSWORD=
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=1d
   
   # Bcrypt
   BCRYPT_SALT_ROUNDS=10
   ```

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `DELETE /api/users/profile` - Delete user account (protected)

### Restaurants

- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant by ID
- `POST /api/restaurants` - Create a new restaurant (merchant only)
- `PUT /api/restaurants/:id` - Update restaurant (merchant only)
- `DELETE /api/restaurants/:id` - Delete restaurant (merchant only)
- `GET /api/restaurants/merchant/restaurants` - Get merchant's restaurants (merchant only)

### Reviews

- `POST /api/reviews` - Create a new review (protected)
- `GET /api/reviews/restaurant/:restaurantId` - Get reviews by restaurant ID
- `GET /api/reviews/user` - Get user's reviews (protected)
- `PUT /api/reviews/:restaurantId/:reviewId` - Update review (protected)
- `DELETE /api/reviews/:restaurantId/:reviewId` - Delete review (protected)

### Search

- `GET /api/search` - Search restaurants by criteria
- `GET /api/search/cuisines` - Get all cuisine types
- `GET /api/search/cities` - Get all cities

## Vector Search Capabilities

FoodFella backend now includes vector search capabilities powered by DataStax Astra DB's vector database. This enables semantic search for restaurants based on natural language queries.

### Features

- **Semantic Search**: Search for restaurants using natural language queries
- **Vector Embeddings**: Restaurant descriptions are converted to vector embeddings using OpenAI's text-embedding-ada-002 model
- **Similarity Search**: Find restaurants with descriptions similar to the search query

### Setup

To use the vector search capabilities, you need:

1. An OpenAI API key for generating embeddings
2. A DataStax Astra DB vector database

Add these to your `.env` file:

```
OPENAI_API_KEY=your_openai_api_key
```

### API Endpoints

- `GET /api/search/semantic?query=your search query` - Search restaurants using natural language
- `GET /api/search/restaurants?query=your search query` - Combined search with vector capabilities

## Database Schema

The application uses the following Cassandra tables:

- `users` - User information
- `restaurants` - Restaurant information
- `restaurant_locations` - Restaurant locations
- `restaurant_images` - Restaurant images
- `reviews` - Restaurant reviews
- `restaurants_by_cuisine` - Restaurants indexed by cuisine type
- `restaurants_by_location` - Restaurants indexed by location

## Testing

The application uses Jest and Supertest for API testing. To run the tests:

```bash
npm test
```

To run a specific test suite:

```bash
npm test -- -t "API Health Check"
```

Note: Tests require a running Cassandra instance or appropriate mocks.

## License

MIT 