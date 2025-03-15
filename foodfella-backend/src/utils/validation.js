/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if valid, false otherwise
 */
exports.isValidPassword = (password) => {
  // Password must be at least 8 characters
  return password && password.length >= 8;
};

/**
 * Validate rating value
 * @param {number} rating - Rating to validate
 * @returns {boolean} True if valid, false otherwise
 */
exports.isValidRating = (rating) => {
  // Rating must be between 1 and 5
  return rating && rating >= 1 && rating <= 5;
};

/**
 * Validate price range
 * @param {string} priceRange - Price range to validate
 * @returns {boolean} True if valid, false otherwise
 */
exports.isValidPriceRange = (priceRange) => {
  // Price range must be one of: $, $$, $$$, $$$$
  const validRanges = ['$', '$$', '$$$', '$$$$'];
  return validRanges.includes(priceRange);
};

/**
 * Validate pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Object} Validated page and limit
 */
exports.validatePagination = (page, limit) => {
  let validatedPage = parseInt(page) || 1;
  let validatedLimit = parseInt(limit) || 10;
  
  // Ensure page is at least 1
  if (validatedPage < 1) {
    validatedPage = 1;
  }
  
  // Ensure limit is between 1 and 100
  if (validatedLimit < 1) {
    validatedLimit = 10;
  } else if (validatedLimit > 100) {
    validatedLimit = 100;
  }
  
  return {
    page: validatedPage,
    limit: validatedLimit,
  };
}; 