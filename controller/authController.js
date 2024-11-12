const User = require('../models/userModel'); // Import User model
const jwt = require('jsonwebtoken'); // For JWT token generation
const bcrypt = require('bcryptjs'); 
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

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user with hashed password
        user = new User({
            name,
            email,
            password: hashedPassword
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

        // Compare entered password with hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
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
            { expiresIn: 5184000 }, // Token expires in approximately 2 months
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

// Update user information
exports.updateUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            errors: errors.array(),
        });
    }

    try {
        // Find the user by ID (from route params)
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                msg: 'User not found',
            });
        }

        // Update user fields if provided in the request body
        if (name) user.name = name;
        if (email) user.email = email;

        // If password is being updated, hash the new password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        // Save updated user to the database
        await user.save();

        res.status(200).json({
            success: true,
            statusCode: 200,
            msg: 'User updated successfully',
            data: user, // Send back updated user data
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error',
        });
    }
};

