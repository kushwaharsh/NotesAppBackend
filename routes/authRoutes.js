const express = require('express');
const { registerUser, loginUser, updateUser , deleteUser , sendOtp , verifyOtp } = require('../controller/authController');
const { check } = require('express-validator'); // For validation
const auth = require('../middleware/authMiddleware'); // Middleware for protected routes
const router = express.Router();




// Route for sending OTP (e.g., via email)
router.post(
    '/sendOtp',
    [
        check('email', 'Please include a valid email').isEmail(),
    ],
    sendOtp
);

// Route for verifying OTP
router.post(
    '/verifyOtp',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('otp', 'OTP is required').exists(),
    ],
    verifyOtp
);

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

// Route for deleting a user by ID (protected)
router.delete('/user/deleteAccount', auth, deleteUser);

module.exports = router;
