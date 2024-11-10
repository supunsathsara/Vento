const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/me', authenticateToken, AuthController.getCurrentUser);

module.exports = router;