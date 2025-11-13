const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');

// Example protected route using the middleware
router.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({
    message: `Welcome to the protected dashboard!`,
    user: req.user, // contains the decoded token payload
  });
});

// Another example protected route
router.get('/profile', verifyToken, (req, res) => {
  // You can fetch user data from DB here if needed using req.user.id
  res.status(200).json({
    message: 'Here is your profile info',
    user: req.user,
  });
});

module.exports = router;
