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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Paper,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { 
  searchRestaurantsByName, 
  searchRestaurantsByCuisine, 
  searchRestaurantsByLocation,
  getAllCuisineTypes, 
  getAllCities
} from '../services/searchService';

const RestaurantList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        
        // Fetch all restaurants
        const restaurantsResponse = await searchRestaurantsByName('');
        if (restaurantsResponse.status === 'success' && restaurantsResponse.data?.restaurants) {
          setRestaurants(restaurantsResponse.data.restaurants);
          setTotalPages(Math.ceil(restaurantsResponse.data.restaurants.length / itemsPerPage));
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
          setTotalPages(Math.ceil(response.data.restaurants.length / itemsPerPage));
          setPage(1);
        } else {
          setRestaurants([]);
          setTotalPages(1);
        }
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCuisineChange = async (cuisine: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCuisine(cuisine);
      
      if (cuisine) {
        const response = await searchRestaurantsByCuisine(cuisine);
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
          setTotalPages(Math.ceil(response.data.restaurants.length / itemsPerPage));
          setPage(1);
        } else {
          setRestaurants([]);
          setTotalPages(1);
        }
      } else {
        // Reset to all restaurants
        const response = await searchRestaurantsByName('');
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
          setTotalPages(Math.ceil(response.data.restaurants.length / itemsPerPage));
          setPage(1);
        }
      }
    } catch (err) {
      console.error('Cuisine filter error:', err);
      setError('Failed to filter by cuisine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedCity(city);
      
      if (city) {
        const response = await searchRestaurantsByLocation(city);
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
          setTotalPages(Math.ceil(response.data.restaurants.length / itemsPerPage));
          setPage(1);
        } else {
          setRestaurants([]);
          setTotalPages(1);
        }
      } else {
        // Reset to all restaurants
        const response = await searchRestaurantsByName('');
        if (response.status === 'success' && response.data?.restaurants) {
          setRestaurants(response.data.restaurants);
          setTotalPages(Math.ceil(response.data.restaurants.length / itemsPerPage));
          setPage(1);
        }
      }
    } catch (err) {
      console.error('City filter error:', err);
      setError('Failed to filter by city. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePriceRangeChange = (priceRange: string) => {
    setSelectedPriceRange(priceRange);
    
    if (priceRange) {
      const filtered = restaurants.filter(restaurant => restaurant.price_range === priceRange);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
      setPage(1);
    } else {
      setTotalPages(Math.ceil(restaurants.length / itemsPerPage));
      setPage(1);
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Apply filters and pagination
  const filteredRestaurants = restaurants
    .filter(restaurant => !selectedPriceRange || restaurant.price_range === selectedPriceRange);
  
  const paginatedRestaurants = filteredRestaurants
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const resetFilters = async () => {
    setSelectedCuisine('');
    setSelectedCity('');
    setSelectedPriceRange('');
    setSearchQuery('');
    
    try {
      setLoading(true);
      const response = await searchRestaurantsByName('');
      if (response.status === 'success' && response.data?.restaurants) {
        setRestaurants(response.data.restaurants);
        setTotalPages(Math.ceil(response.data.restaurants.length / itemsPerPage));
        setPage(1);
      }
    } catch (err) {
      console.error('Reset filters error:', err);
      setError('Failed to reset filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Restaurants
      </Typography>
      
      {/* Search and Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 6 }}>
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
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
              )
            }}
          />
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterListIcon sx={{ mr: 1 }} /> Filters
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="cuisine-select-label">Cuisine</InputLabel>
              <Select
                labelId="cuisine-select-label"
                id="cuisine-select"
                value={selectedCuisine}
                label="Cuisine"
                onChange={(e) => handleCuisineChange(e.target.value)}
              >
                <MenuItem value="">All Cuisines</MenuItem>
                {cuisines.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>{cuisine}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="city-select-label">City</InputLabel>
              <Select
                labelId="city-select-label"
                id="city-select"
                value={selectedCity}
                label="City"
                onChange={(e) => handleCityChange(e.target.value)}
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="price-select-label">Price Range</InputLabel>
              <Select
                labelId="price-select-label"
                id="price-select"
                value={selectedPriceRange}
                label="Price Range"
                onChange={(e) => handlePriceRangeChange(e.target.value)}
              >
                <MenuItem value="">All Prices</MenuItem>
                <MenuItem value="$">$ (Budget)</MenuItem>
                <MenuItem value="$$">$$ (Moderate)</MenuItem>
                <MenuItem value="$$$">$$$ (Expensive)</MenuItem>
                <MenuItem value="$$$$">$$$$ (Very Expensive)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={resetFilters}
            startIcon={<FilterListIcon />}
          >
            Reset Filters
          </Button>
        </Box>
      </Paper>
      
      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Results Count */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {loading ? 'Searching...' : 
            `${filteredRestaurants.length} ${filteredRestaurants.length === 1 ? 'Restaurant' : 'Restaurants'} Found`}
        </Typography>
      </Box>
      
      {/* Restaurants Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : paginatedRestaurants.length > 0 ? (
        <Grid container spacing={4}>
          {paginatedRestaurants.map((restaurant) => (
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
                    {restaurant.description.length > 120 
                      ? `${restaurant.description.substring(0, 120)}...` 
                      : restaurant.description}
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
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No restaurants found matching your criteria
          </Typography>
          <Button 
            variant="contained" 
            onClick={resetFilters}
            sx={{ mt: 2 }}
          >
            Reset Filters
          </Button>
        </Box>
      )}
      
      {/* Pagination */}
      {filteredRestaurants.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default RestaurantList; 