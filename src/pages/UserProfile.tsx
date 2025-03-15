import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Rating
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { getUserReviews, deleteReview } from '../services/reviewService';

const UserProfile = () => {
  const { user, token, isAuthenticated, isLoading: authLoading, error: authError, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login', { state: { from: '/profile' } });
    }
    
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, isAuthenticated, authLoading, navigate]);
  
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!token) return;
      
      try {
        setLoadingReviews(true);
        setReviewsError(null);
        
        const response = await getUserReviews(token);
        if (response.status === 'success' && response.data?.reviews) {
          setReviews(response.data.reviews);
        } else {
          setReviewsError(response.message || 'Failed to load reviews');
        }
      } catch (err) {
        console.error('Error fetching user reviews:', err);
        setReviewsError('An error occurred while loading your reviews');
      } finally {
        setLoadingReviews(false);
      }
    };
    
    fetchUserReviews();
  }, [token]);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form when entering edit mode
      setName(user?.name || '');
      setEmail(user?.email || '');
      setUpdateError(null);
      setUpdateSuccess(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setUpdateError('Name is required');
      return;
    }
    
    try {
      setIsSaving(true);
      setUpdateError(null);
      setUpdateSuccess(false);
      
      await updateUserProfile({ name });
      
      setIsEditing(false);
      setUpdateSuccess(true);
    } catch (err) {
      console.error('Profile update error:', err);
      setUpdateError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!reviewToDelete || !token) return;
    
    try {
      setDeleteLoading(true);
      
      const response = await deleteReview(reviewToDelete, token);
      
      if (response.status === 'success') {
        // Remove the deleted review from the list
        setReviews(reviews.filter(review => review.id !== reviewToDelete));
        setDeleteDialogOpen(false);
        setReviewToDelete(null);
      } else {
        setReviewsError(response.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error('Delete review error:', err);
      setReviewsError('An error occurred while deleting the review');
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
        Your Profile
      </Typography>
      
      <Grid container spacing={6}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                  mr: 3
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {user?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Box>
            
            {authError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {authError}
              </Alert>
            )}
            
            {updateError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {updateError}
              </Alert>
            )}
            
            {updateSuccess && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Profile updated successfully!
              </Alert>
            )}
            
            {isEditing ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  disabled
                  margin="normal"
                  helperText="Email cannot be changed"
                />
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSaving}
                  >
                    {isSaving ? <CircularProgress size={24} /> : 'Save Changes'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    onClick={handleEditToggle}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Divider sx={{ my: 3 }} />
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Account Type
                  </Typography>
                  <Typography variant="body1">
                    {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1">
                    {new Date().toLocaleDateString()} {/* Replace with actual join date when available */}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                  <Button
                    variant="contained"
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* User Reviews */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Your Reviews
            </Typography>
            
            {reviewsError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {reviewsError}
              </Alert>
            )}
            
            {loadingReviews ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : reviews.length > 0 ? (
              <List sx={{ width: '100%' }}>
                {reviews.map((review) => (
                  <Card key={review.id} sx={{ mb: 3 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6">
                          {review.restaurant_name || 'Restaurant'}
                        </Typography>
                        <Rating value={review.rating} readOnly />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                      
                      <Typography variant="body1" paragraph>
                        {review.comment}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          size="small"
                          onClick={() => navigate(`/restaurants/${review.restaurant_id}`)}
                        >
                          View Restaurant
                        </Button>
                        
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(review.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  You haven't written any reviews yet.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/restaurants')}
                >
                  Browse Restaurants
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Delete Review Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile; 