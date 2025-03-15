import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 6, 
          borderRadius: 2, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <RestaurantIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
        
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mb: 4 }}>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={RouterLink}
            to="/"
          >
            Go to Home
          </Button>
          
          <Button 
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/restaurants"
          >
            Browse Restaurants
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound; 