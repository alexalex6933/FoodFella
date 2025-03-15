import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

interface AuthProps {
  isRegister?: boolean;
}

const Auth: React.FC<AuthProps> = ({ isRegister = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>(isRegister ? 'register' : 'login');
  const [testResult, setTestResult] = useState<string | null>(null);
  
  const { login, register, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const validateForm = () => {
    setFormError('');
    
    if (mode === 'register') {
      if (!name.trim()) {
        setFormError('Name is required');
        return false;
      }
      
      if (password !== confirmPassword) {
        setFormError('Passwords do not match');
        return false;
      }
      
      if (password.length < 6) {
        setFormError('Password must be at least 6 characters');
        return false;
      }
    }
    
    if (!email.trim()) {
      setFormError('Email is required');
      return false;
    }
    
    if (!password) {
      setFormError('Password is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      
      // If no error was thrown, redirect
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormError('');
  };

  // Test backend connectivity
  const testBackendConnection = async () => {
    try {
      setTestResult('Testing connection...');
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setTestResult(`Connection successful: ${JSON.stringify(data)}`);
      console.log('Backend connection test:', data);
    } catch (err) {
      setTestResult(`Connection failed: ${err instanceof Error ? err.message : String(err)}`);
      console.error('Backend connection test failed:', err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Typography>
          
          {(error || formError) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError || error}
            </Alert>
          )}
          
          {testResult && (
            <Alert severity={testResult.includes('successful') ? 'success' : 'error'} sx={{ mb: 3 }}>
              {testResult}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {mode === 'register' && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              
              {mode === 'register' && (
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isLoading}
                  sx={{ py: 1.5 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={testBackendConnection}
                  sx={{ py: 1.5 }}
                >
                  Test Backend Connection
                </Button>
              </Grid>
              
              <Grid item xs={12} textAlign="center">
                <Typography variant="body2">
                  {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                  <Link 
                    component="button" 
                    variant="body2" 
                    onClick={toggleMode}
                    sx={{ fontWeight: 'bold' }}
                  >
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Auth;