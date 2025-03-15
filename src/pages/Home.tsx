import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Stack,
  Link,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { 
  searchRestaurantsByName, 
  searchRestaurantsByCuisine, 
  getAllCuisineTypes, 
  getAllCities,
  searchRestaurantsByLocation
} from '../services/searchService';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch all restaurants
        const restaurantsResponse = await searchRestaurantsByName('');
        if (restaurantsResponse.status === 'success' && restaurantsResponse.data?.restaurants) {
          setRestaurants(restaurantsResponse.data.restaurants);
        }
        
        // Fetch all cuisine types
        const cuisinesResponse = await getAllCuisineTypes();
        if (cuisinesResponse.status === 'success' && cuisinesResponse.data?.cuisines) {
          setCuisines(cuisinesResponse.data.cuisines);
        }
        
        // Fetch all cities
        const citiesResponse = await getAllCities();
        if (citiesResponse.status === 'success' && citiesResponse.data?.cities) {
          setCities(citiesResponse.data.cities);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (searchQuery.trim()) {
        const response = await searchRestaurantsByName(searchQuery);
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
        } else {
          setRestaurants([]);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCuisineFilter = async (cuisine: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (selectedCuisine === cuisine) {
        setSelectedCuisine(null);
        // Reset to all restaurants
        const response = await searchRestaurantsByName('');
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
        }
      } else {
        setSelectedCuisine(cuisine);
        const response = await searchRestaurantsByCuisine(cuisine);
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
        } else {
          setRestaurants([]);
        }
      }
    } catch (err) {
      console.error('Cuisine filter error:', err);
      setError('Failed to filter by cuisine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCityFilter = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (selectedCity === city) {
        setSelectedCity(null);
        // Reset to all restaurants
        const response = await searchRestaurantsByName('');
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
        }
      } else {
        setSelectedCity(city);
        const response = await searchRestaurantsByLocation(city);
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
        } else {
          setRestaurants([]);
        }
      }
    } catch (err) {
      console.error('City filter error:', err);
      setError('Failed to filter by city. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box 
        sx={{ 
          py: 8, 
          textAlign: 'center',
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(https://source.unsplash.com/random/1200x600/?food)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          mb: 6,
          mt: 4
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Discover Great Food Near You
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: '800px', mx: 'auto', mb: 4 }}>
          Find the best restaurants, cafes, and street food in your area
        </Typography>
        
        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ maxWidth: '600px', mx: 'auto' }}>
          <TextField
            fullWidth
            placeholder="Search for restaurants, cuisines, or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Search'}
                  </Button>
                </InputAdornment>
              ),
              sx: { 
                borderRadius: 2,
                py: 0.5,
                px: 2,
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }
            }}
          />
        </Box>
      </Box>

      {/* Filters Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Cuisine
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {cuisines.map((cuisine) => (
            <Chip
              key={cuisine}
              label={cuisine}
              onClick={() => handleCuisineFilter(cuisine)}
              color={selectedCuisine === cuisine ? 'primary' : 'default'}
              variant={selectedCuisine === cuisine ? 'filled' : 'outlined'}
              icon={<RestaurantIcon />}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>

        <Typography variant="h6" gutterBottom>
          Filter by Location
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
          {cities.map((city) => (
            <Chip
              key={city}
              label={city}
              onClick={() => handleCityFilter(city)}
              color={selectedCity === city ? 'primary' : 'default'}
              variant={selectedCity === city ? 'filled' : 'outlined'}
              icon={<LocationOnIcon />}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>


  return (
    <div>
      <div className="w-full h-[300px] relative mb-8">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          alt="Food Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-4">
            Creating A World Where No Meal Goes To Waste.
          </h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Restaurants Near You</h1>
          <button
            onClick={() => setShowMap(true)}
            className="flex items-center space-x-2 bg-[#1db954] text-white px-4 py-2 rounded-full hover:bg-[#169c46] transition-colors"
          >
            <MapPin className="h-5 w-5" />
            <span>View Map</span>
          </button>
        </div>


      {/* Error Message */}
      {error && (
        <Paper sx={{ p: 2, mb: 4, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      {/* Restaurants Grid */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
        {loading ? 'Loading Restaurants...' : 
          restaurants.length > 0 ? 'Restaurants' : 'No Restaurants Found'}
      </Typography>

      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {restaurants.map((restaurant) => (
            <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`https://source.unsplash.com/random/300x200/?restaurant,${restaurant.cuisine_type}`}
                  alt={restaurant.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {restaurant.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {restaurant.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip label={restaurant.cuisine_type} size="small" color="primary" variant="outlined" />
                    <Chip label={restaurant.price_range} size="small" />
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    component={RouterLink} 
                    to={`/restaurants/${restaurant.id}`} 
                    variant="contained" 
                    fullWidth
                  >
                    View Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Home;