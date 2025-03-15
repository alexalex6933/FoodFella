# FoodFella API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

### Register a new user

**Endpoint:** `POST /users/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "customer" // or "merchant"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

### Login

**Endpoint:** `POST /users/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "jwt_token_here",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

### Get User Profile

**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    }
  }
}
```

### Update User Profile

**Endpoint:** `PUT /users/profile`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated@example.com",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "updated@example.com",
      "firstName": "Updated",
      "lastName": "Name",
      "role": "customer"
    }
  }
}
```

### Delete User Account

**Endpoint:** `DELETE /users/profile`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

## Restaurants

### Get All Restaurants

**Endpoint:** `GET /restaurants?page=1&limit=10`

**Response:**
```json
{
  "status": "success",
  "data": {
    "restaurants": [
      {
        "id": "restaurant_id",
        "name": "Restaurant Name",
        "description": "Restaurant description",
        "cuisineType": "Italian",
        "priceRange": "$$",
        "merchantId": "merchant_id",
        "locations": [
          {
            "restaurantId": "restaurant_id",
            "locationId": "location_id",
            "address": "123 Main St",
            "city": "New York",
            "state": "NY",
            "zipCode": "10001",
            "latitude": 40.7128,
            "longitude": -74.0060
          }
        ],
        "images": [
          {
            "restaurantId": "restaurant_id",
            "imageId": "image_id",
            "imageUrl": "https://example.com/image.jpg",
            "isPrimary": true
          }
        ],
        "rating": 4.5
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

### Get Restaurant by ID

**Endpoint:** `GET /restaurants/:id`

**Response:**
```json
{
  "status": "success",
  "data": {
    "restaurant": {
      "id": "restaurant_id",
      "name": "Restaurant Name",
      "description": "Restaurant description",
      "cuisineType": "Italian",
      "priceRange": "$$",
      "merchantId": "merchant_id",
      "locations": [
        {
          "restaurantId": "restaurant_id",
          "locationId": "location_id",
          "address": "123 Main St",
          "city": "New York",
          "state": "NY",
          "zipCode": "10001",
          "latitude": 40.7128,
          "longitude": -74.0060
        }
      ],
      "images": [
        {
          "restaurantId": "restaurant_id",
          "imageId": "image_id",
          "imageUrl": "https://example.com/image.jpg",
          "isPrimary": true
        }
      ],
      "rating": 4.5
    }
  }
}
```

### Create Restaurant (Merchant Only)

**Endpoint:** `POST /restaurants`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "name": "New Restaurant",
  "description": "Restaurant description",
  "cuisineType": "Italian",
  "priceRange": "$$",
  "locations": [
    {
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  ],
  "images": [
    {
      "imageUrl": "https://example.com/image.jpg",
      "isPrimary": true
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "restaurant": {
      "id": "restaurant_id",
      "name": "New Restaurant",
      "description": "Restaurant description",
      "cuisineType": "Italian",
      "priceRange": "$$",
      "merchantId": "merchant_id",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Update Restaurant (Merchant Only)

**Endpoint:** `PUT /restaurants/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "name": "Updated Restaurant",
  "description": "Updated description",
  "cuisineType": "French",
  "priceRange": "$$$",
  "locations": [
    {
      "address": "456 Main St",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90001",
      "latitude": 34.0522,
      "longitude": -118.2437
    }
  ],
  "images": [
    {
      "imageUrl": "https://example.com/updated-image.jpg",
      "isPrimary": true
    }
  ]
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "restaurant": {
      "id": "restaurant_id",
      "name": "Updated Restaurant",
      "description": "Updated description",
      "cuisineType": "French",
      "priceRange": "$$$",
      "merchantId": "merchant_id",
      "locations": [
        {
          "restaurantId": "restaurant_id",
          "locationId": "location_id",
          "address": "456 Main St",
          "city": "Los Angeles",
          "state": "CA",
          "zipCode": "90001",
          "latitude": 34.0522,
          "longitude": -118.2437
        }
      ],
      "images": [
        {
          "restaurantId": "restaurant_id",
          "imageId": "image_id",
          "imageUrl": "https://example.com/updated-image.jpg",
          "isPrimary": true
        }
      ],
      "rating": 4.5
    }
  }
}
```

### Delete Restaurant (Merchant Only)

**Endpoint:** `DELETE /restaurants/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

### Get Merchant Restaurants (Merchant Only)

**Endpoint:** `GET /restaurants/merchant`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "restaurants": [
      {
        "id": "restaurant_id",
        "name": "Restaurant Name",
        "description": "Restaurant description",
        "cuisineType": "Italian",
        "priceRange": "$$",
        "merchantId": "merchant_id",
        "locations": [
          {
            "restaurantId": "restaurant_id",
            "locationId": "location_id",
            "address": "123 Main St",
            "city": "New York",
            "state": "NY",
            "zipCode": "10001",
            "latitude": 40.7128,
            "longitude": -74.0060
          }
        ],
        "images": [
          {
            "restaurantId": "restaurant_id",
            "imageId": "image_id",
            "imageUrl": "https://example.com/image.jpg",
            "isPrimary": true
          }
        ],
        "rating": 4.5
      }
    ]
  }
}
```

## Reviews

### Create Review

**Endpoint:** `POST /reviews`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "restaurantId": "restaurant_id",
  "rating": 5,
  "comment": "Great food and service!"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "review": {
      "restaurantId": "restaurant_id",
      "userId": "user_id",
      "reviewId": "review_id",
      "rating": 5,
      "comment": "Great food and service!",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Get Reviews by Restaurant ID

**Endpoint:** `GET /reviews/restaurant/:restaurantId?page=1&limit=10`

**Response:**
```json
{
  "status": "success",
  "data": {
    "reviews": [
      {
        "restaurantId": "restaurant_id",
        "userId": "user_id",
        "reviewId": "review_id",
        "rating": 5,
        "comment": "Great food and service!",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

### Get User Reviews

**Endpoint:** `GET /reviews/user?page=1&limit=10`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "reviews": [
      {
        "restaurantId": "restaurant_id",
        "userId": "user_id",
        "reviewId": "review_id",
        "rating": 5,
        "comment": "Great food and service!",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 20,
      "page": 1,
      "limit": 10,
      "totalPages": 2
    }
  }
}
```

### Update Review

**Endpoint:** `PUT /reviews/:restaurantId/:reviewId`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review comment"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "review": {
      "restaurantId": "restaurant_id",
      "userId": "user_id",
      "reviewId": "review_id",
      "rating": 4,
      "comment": "Updated review comment",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    }
  }
}
```

### Delete Review

**Endpoint:** `DELETE /reviews/:restaurantId/:reviewId`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

## Search

### Search Restaurants

```
GET /api/search/restaurants
```

Search for restaurants using various criteria.

**Query Parameters**:
- `name`: Search by restaurant name
- `cuisine`: Search by cuisine type
- `city`: Search by city
- `query`: Semantic search using natural language (uses vector search)

**Response**:
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "restaurants": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Pasta Palace",
        "description": "Authentic Italian pasta dishes",
        "cuisine_type": "Italian",
        "price_range": "moderate",
        "merchant_id": "7c11e1ce-1144-42c7-8bfd-e3b8d2696000"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Pizza Paradise",
        "description": "New York style pizza",
        "cuisine_type": "Italian",
        "price_range": "budget",
        "merchant_id": "7c11e1ce-1144-42c7-8bfd-e3b8d2696001"
      }
    ]
  }
}
```

### Semantic Search

```
GET /api/search/semantic
```

Search for restaurants using natural language queries with vector similarity.

**Query Parameters**:
- `query`: Natural language search query (required)
- `limit`: Maximum number of results to return (default: 10)

**Response**:
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "restaurants": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Pasta Palace",
        "description": "Authentic Italian pasta dishes",
        "cuisine_type": "Italian",
        "price_range": "moderate",
        "merchant_id": "7c11e1ce-1144-42c7-8bfd-e3b8d2696000",
        "similarity": 0.89
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Pizza Paradise",
        "description": "New York style pizza",
        "cuisine_type": "Italian",
        "price_range": "budget",
        "merchant_id": "7c11e1ce-1144-42c7-8bfd-e3b8d2696001",
        "similarity": 0.76
      }
    ]
  }
}
```

### Get Cuisine Types

**Endpoint:** `GET /search/cuisines`

**Response:**
```json
{
  "status": "success",
  "data": {
    "cuisineTypes": [
      "Italian",
      "Chinese",
      "Mexican",
      "Indian",
      "Japanese"
    ]
  }
}
```

### Get Cities

**Endpoint:** `GET /search/cities`

**Response:**
```json
{
  "status": "success",
  "data": {
    "cities": [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix"
    ]
  }
}
```

## Testing

The API includes comprehensive test suites for all endpoints. Tests are written using Jest and Supertest.

### Running Tests

To run all tests:

```bash
npm test
```

To run a specific test suite:

```bash
npm test -- -t "API Health Check"
```

### Test Coverage

The test suite covers:
- User authentication (registration, login, token verification)
- Restaurant management (create, read, update, delete)
- Review management (create, read, update, delete)
- Search functionality (by name, cuisine, location)

### Health Check

```
GET /health
```

Returns the status of the API server.

**Response**:
```json
{
  "status": "ok",
  "message": "Server is running"
}
``` 