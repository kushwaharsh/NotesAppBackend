const express = require('express');
const { registerUser, loginUser, updateUser } = require('../controller/authController');
const { check } = require('express-validator'); // For validation
const auth = require('../middleware/authMiddleware'); // Middleware for protected routes
const router = express.Router();

// Register route (with validation)
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    ],
    registerUser
);

// Login route (with validation)
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    loginUser
);

// Update user route (protected, with validation)
router.put(
    '/users/update/:id',
    auth, // Authentication middleware to protect this route
    [
        check('name', 'Name is required').optional().not().isEmpty(),
        check('email', 'Please include a valid email').optional().isEmail(),
        check('password', 'Password must be at least 6 characters long').optional().isLength({ min: 6 }),
    ],
    updateUser
);

module.exports = router;
