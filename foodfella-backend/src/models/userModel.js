const { getCollection } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class User {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  static async create(userData) {
    try {
      const id = uuidv4();
      const hashedPassword = await bcrypt.hash(
        userData.password,
        parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
      );
      
      const now = new Date();
      
      const usersCollection = await getCollection('users');
      
      const user = {
        id,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role || 'customer',
        created_at: now,
        updated_at: now
      };
      
      await usersCollection.create(id, user);
      
      // Return user without password
      return {
        id,
        email: userData.email.toLowerCase(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'customer',
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Object|null} User object or null if not found
   */
  static async findByEmail(email) {
    try {
      const usersCollection = await getCollection('users');
      
      // Query by email using the findOne method
      const response = await usersCollection.find({ email: email.toLowerCase() });
      
      if (!response.data || response.data.length === 0) {
        return null;
      }
      
      const user = response.data[0];
      
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }
  
  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Object|null} User object or null if not found
   */
  static async findById(id) {
    try {
      const usersCollection = await getCollection('users');
      
      const response = await usersCollection.get(id);
      
      if (!response || !response.data) {
        return null;
      }
      
      const user = response.data;
      
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      };
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
  
  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Object} Updated user
   */
  static async update(id, userData) {
    try {
      const user = await this.findById(id);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const usersCollection = await getCollection('users');
      
      const now = new Date();
      const updateData = { updated_at: now };
      
      if (userData.firstName) {
        updateData.first_name = userData.firstName;
      }
      
      if (userData.lastName) {
        updateData.last_name = userData.lastName;
      }
      
      if (userData.email) {
        updateData.email = userData.email.toLowerCase();
      }
      
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(
          userData.password,
          parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
        );
        updateData.password = hashedPassword;
      }
      
      await usersCollection.update(id, updateData);
      
      // Get updated user
      return await this.findById(id);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {boolean} True if deleted, false otherwise
   */
  static async delete(id) {
    try {
      const usersCollection = await getCollection('users');
      
      await usersCollection.delete(id);
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
  
  /**
   * Compare password with hashed password
   * @param {string} password - Plain password
   * @param {string} hashedPassword - Hashed password
   * @returns {boolean} True if passwords match, false otherwise
   */
  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 