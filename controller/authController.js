const User = require('../models/userModel'); // Import User model
const jwt = require('jsonwebtoken'); // For JWT token generation
const { validationResult } = require('express-validator'); // For input validation (optional)

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            statusCode: 400,
            errors: errors.array() 
        });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ 
                success: false,
                statusCode: 400,
                msg: 'User already exists' 
            });
        }

        // Create new user (password stored as plain text)
        user = new User({
            name,
            email,
            password, // Plain text password (not hashed)
        });

        // Save user to the database
        await user.save();

        // Payload for JWT
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Sign the JWT token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '21h' }, 
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ // Use 201 status code for successful creation
                    success: true,
                    statusCode: 201,
                    msg: 'User registered successfully',
                    token, // Send back token as response
                    data: user
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            statusCode: 400,
            errors: errors.array() 
        });
    }

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false,
                statusCode: 400,
                msg: 'Invalid credentials' 
            });
        }

        // Compare entered password with stored plain-text password
        if (password !== user.password) {
            return res.status(400).json({ 
                success: false,
                statusCode: 400,
                msg: 'Invalid credentials' 
            });
        }

        // Payload for JWT
        const payload = {
            user: {
                id: user.id,
            },
        };

        // Sign the JWT token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '9h' }, // Token expires in 9 hours
            (err, token) => {
                if (err) throw err;
                res.status(200).json({ 
                    success: true,
                    statusCode: 200,
                    msg: "Login successful",
                    token, // Send back token as response
                    data: user // Send back user data
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};

// Update an existing user
exports.updateUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            statusCode: 400,
            errors: errors.array() 
        });
    }

    try {
        // Find user by their ID (assuming it's passed as a URL parameter)
        let user = await User.findById(req.params.id);

        // If user doesn't exist, return an error
        if (!user) {
            return res.status(404).json({ 
                success: false,
                statusCode: 404,
                msg: 'User not found' 
            });
        }

        // Update user details if provided
        if (name) user.name = name;
        if (email) user.email = email;

        // Update password without hashing it (storing as plain text)
        if (password) {
            user.password = password; // It's recommended to hash passwords
        }

        // Save the updated user in the database
        await user.save();

        res.status(200).json({ 
            success: true,
            statusCode: 200,
            msg: 'User updated successfully',
            user // Send back the updated user object
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};


