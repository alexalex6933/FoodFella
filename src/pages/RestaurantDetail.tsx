import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Rating,
  TextField,
  CircularProgress,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getRestaurantById } from '../services/restaurantService';
import { getRestaurantReviews, createReview, updateReview, deleteReview } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  
  const [restaurant, setRestaurant] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [reviewRating, setReviewRating] = useState<number | null>(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch restaurant details
        const restaurantResponse = await getRestaurantById(id);
        if (restaurantResponse.status === 'success' && restaurantResponse.data?.restaurant) {
          setRestaurant(restaurantResponse.data.restaurant);
        } else {
          setError('Restaurant not found');
        }
        
        // Fetch restaurant reviews
        const reviewsResponse = await getRestaurantReviews(id);
        if (reviewsResponse.status === 'success' && reviewsResponse.data?.reviews) {
          setReviews(reviewsResponse.data.reviews);
        }
      } catch (err) {
        console.error('Error fetching restaurant data:', err);
        setError('Failed to load restaurant data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRestaurantData();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/restaurants/${id}` } });
      return;
    }
    
    if (!reviewRating) {
      setReviewError('Please select a rating');
      return;
    }
    
    try {
      setReviewSubmitting(true);
      setReviewError(null);
      
      if (editingReview) {
        // Update existing review
        const response = await updateReview(
          editingReview.id,
          {
            rating: reviewRating,
            comment: reviewComment,
            restaurant_id: id as string
          },
          token as string
        );
        
        if (response.status === 'success' && response.data?.review) {
          // Update the reviews list
          setReviews(reviews.map(review => 
            review.id === editingReview.id ? response.data?.review : review
          ));
          
          // Reset form
          setReviewRating(0);
          setReviewComment('');
          setEditingReview(null);
        } else {
          setReviewError(response.message || 'Failed to update review');
        }
      } else {
        // Create new review
        const response = await createReview(
          {
            rating: reviewRating,
            comment: reviewComment,
            restaurant_id: id as string
          },
          token as string
        );
        
        if (response.status === 'success' && response.data?.review) {
          // Add the new review to the list
          const newReview = {
            ...response.data.review,
            user: {
              id: user?.id,
              name: user?.name
            }
          };
          setReviews([newReview, ...reviews]);
          
          // Reset form
          setReviewRating(0);
          setReviewComment('');
        } else {
          setReviewError(response.message || 'Failed to submit review');
        }
      }
    } catch (err) {
      console.error('Review submission error:', err);
      setReviewError('An error occurred while submitting your review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setReviewRating(review.rating);
    setReviewComment(review.comment);
    
    // Scroll to review form
    document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete || !token) return;
    
    try {
      const response = await deleteReview(reviewToDelete, token);
      
      if (response.status === 'success') {
        // Remove the deleted review from the list
        setReviews(reviews.filter(review => review.id !== reviewToDelete));
        setDeleteDialogOpen(false);
        setReviewToDelete(null);
      } else {
        setError(response.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      setError('An error occurred while deleting the review');
    }
  };

  const cancelEditReview = () => {
    setEditingReview(null);
    setReviewRating(0);
    setReviewComment('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !restaurant) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Restaurant not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/restaurants')}>
          Back to Restaurants
        </Button>
      </Container>
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Restaurant Header */}
      <Box sx={{ mb: 6 }}>
        <Box 
          sx={{ 
            height: 300, 
            borderRadius: 2, 
            overflow: 'hidden', 
            mb: 4,
            backgroundImage: `url(https://source.unsplash.com/random/1200x600/?restaurant,${restaurant.cuisine_type})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              p: 3, 
              background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
              color: 'white'
            }}
          >
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
              {restaurant.name}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              About
            </Typography>
            <Typography variant="body1" paragraph>
              {restaurant.description}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              <Chip 
                icon={<LocationOnIcon />} 
                label={restaurant.address || 'Location not available'} 
                variant="outlined" 
              />
              <Chip 
                icon={<AccessTimeIcon />} 
                label={restaurant.hours || 'Hours not available'} 
                variant="outlined" 
              />
              <Chip 
                icon={<AttachMoneyIcon />} 
                label={restaurant.price_range} 
                variant="outlined" 
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Restaurant Info
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cuisine
                  </Typography>
                  <Typography variant="body1">
                    {restaurant.cuisine_type}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={averageRating} precision={0.5} readOnly />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Price Range
                  </Typography>
                  <Typography variant="body1">
                    {restaurant.price_range}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Reviews Section */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Reviews
        </Typography>
        
        {/* Review Form */}
        <Paper id="review-form" elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {editingReview ? 'Edit Your Review' : 'Write a Review'}
          </Typography>
          
          {!isAuthenticated && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Please <Button color="inherit" onClick={() => navigate('/login', { state: { from: `/restaurants/${id}` } })}>login</Button> to leave a review
            </Alert>
          )}
          
          {reviewError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {reviewError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleReviewSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography component="legend">Your Rating</Typography>
              <Rating
                name="rating"
                value={reviewRating}
                onChange={(_, newValue) => setReviewRating(newValue)}
                disabled={!isAuthenticated || reviewSubmitting}
                size="large"
              />
            </Box>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              disabled={!isAuthenticated || reviewSubmitting}
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isAuthenticated || reviewSubmitting}
              >
                {reviewSubmitting ? <CircularProgress size={24} /> : 
                  editingReview ? 'Update Review' : 'Submit Review'}
              </Button>
              
              {editingReview && (
                <Button
                  variant="outlined"
                  onClick={cancelEditReview}
                  disabled={reviewSubmitting}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
        
        {/* Reviews List */}
        {reviews.length > 0 ? (
          <List>
            {reviews.map((review) => (
              <Paper key={review.id} elevation={1} sx={{ mb: 3, p: 0 }}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    user && user.id === review.user_id ? (
                      <Box>
                        <Button 
                          color="primary" 
                          onClick={() => handleEditReview(review)}
                        >
                          Edit
                        </Button>
                        <Button 
                          color="error" 
                          onClick={() => handleDeleteClick(review.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    ) : null
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {review.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" component="span">
                          {review.user?.name || 'Anonymous'}
                        </Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                          sx={{ display: 'block', my: 1 }}
                        >
                          {review.comment}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No reviews yet. Be the first to review this restaurant!
          </Typography>
        )}
      </Box>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RestaurantDetail;