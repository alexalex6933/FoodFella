const { client } = require('../config/database');
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
      
      const query = `
        INSERT INTO users (
          id, email, password, first_name, last_name, role, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        id,
        userData.email.toLowerCase(),
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role || 'customer',
        now,
        now
      ];
      
      await client.execute(query, params, { prepare: true });
      
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
      const query = 'SELECT * FROM users WHERE email = ? ALLOW FILTERING';
      const result = await client.execute(query, [email.toLowerCase()], { prepare: true });
      
      if (result.rowLength === 0) {
        return null;
      }
      
      const user = result.first();
      
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
      const query = 'SELECT * FROM users WHERE id = ?';
      const result = await client.execute(query, [id], { prepare: true });
      
      if (result.rowLength === 0) {
        return null;
      }
      
      const user = result.first();
      
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
      
      const now = new Date();
      const updateFields = [];
      const params = [];
      
      if (userData.firstName) {
        updateFields.push('first_name = ?');
        params.push(userData.firstName);
      }
      
      if (userData.lastName) {
        updateFields.push('last_name = ?');
        params.push(userData.lastName);
      }
      
      if (userData.email) {
        updateFields.push('email = ?');
        params.push(userData.email.toLowerCase());
      }
      
      if (userData.password) {
        const hashedPassword = await bcrypt.hash(
          userData.password,
          parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)
        );
        updateFields.push('password = ?');
        params.push(hashedPassword);
      }
      
      updateFields.push('updated_at = ?');
      params.push(now);
      
      // Add ID at the end for WHERE clause
      params.push(id);
      
      const query = `
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `;
      
      await client.execute(query, params, { prepare: true });
      
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
      const query = 'DELETE FROM users WHERE id = ?';
      await client.execute(query, [id], { prepare: true });
      
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