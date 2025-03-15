// Verify token
router.get('/verify', authController.protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    isValid: true,
    data: {
      user: {
        id: req.user.id,
        role: req.user.role
      }
    }
  });
}); 