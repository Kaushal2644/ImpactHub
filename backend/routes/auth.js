const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  register,
  login,
  getMe,
  logout,
  updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Local auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updatepassword', protect, updatePassword);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
    session: false
  }),
  (req, res) => {
    // Generate JWT token for google user
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&role=${req.user.role}&avatar=${encodeURIComponent(req.user.avatar || '')}`
    );
  }
);

module.exports = router;