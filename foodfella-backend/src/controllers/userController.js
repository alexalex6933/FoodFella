const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * Register a new user
 * @route POST /api/users/register
 * @access Public
 */
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists with this email',
      });
    }
    
    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role === 'merchant' ? 'merchant' : 'customer', // Only allow merchant or customer roles
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error registering user',
    });
  }
};

/**
 * Login user
 * @route POST /api/users/login
 * @access Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }
    
    // Check if user exists
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }
    
    // Check if password is correct
    const isPasswordCorrect = await User.comparePassword(password, user.password);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials',
      });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error logging in user',
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/users/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting user profile',
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Update user
    const updatedUser = await User.update(req.user.id, {
      firstName,
      lastName,
      email,
      password,
    });
    
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error updating user profile',
    });
  }
};

/**
 * Delete user account
 * @route DELETE /api/users/profile
 * @access Private
 */
exports.deleteAccount = async (req, res) => {
  try {
    await User.delete(req.user.id);
    
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error deleting user account',
    });
  }
}; 