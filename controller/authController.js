const User = require('../models/userModel'); // Import User model
const jwt = require('jsonwebtoken'); // For JWT token generation
const bcrypt = require('bcryptjs'); 
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator'); // For input validation (optional)
const Note = require('../models/notesModel'); // Import Note model
const Tag = require('../models/tagModel');
const dotenv = require('dotenv');


dotenv.config();


// Create a transporter using your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS,  // Your email password or app-specific password
    }
});


const otpStore = {}; 


exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        const isExists = !!user;

        // Generate a random OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Store OTP in memory with an expiration (5 minutes)
        otpStore[email] = {
            otp,
            expiry: Date.now() + 5 * 60 * 1000 // 5 minutes from now
        };

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: email, 
            subject: 'Your OTP for Authentication',
            text: `Your OTP is: ${otp}. It will expire in 5 minutes.`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending OTP:', err);
                return res.status(500).json({
                    success: false,
                    statusCode: 500,
                    msg: 'Server error while sending OTP'
                });
            }

            // Send a success response without any additional data
            res.status(200).json({
                success: true,
                statusCode: 200,
                msg: 'OTP sent successfully',
                isExists,
                email // Indicate whether the user exists
            });
        });
    } catch (err) {
        console.error('Error in sendOtp:', err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error while sending OTP'
        });
    }
};


// Function to verify OTP
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Retrieve the OTP from the memory store
        const sentOtpData = otpStore[email];

        // If no OTP was sent or the OTP is expired
        if (!sentOtpData || sentOtpData.expiry < Date.now()) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                msg: 'OTP not sent or expired'
            });
        }

        // Verify OTP
        if (sentOtpData.otp !== otp) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                msg: 'Invalid OTP'
            });
        }

        // OTP is valid, clear OTP from memory
        delete otpStore[email];

        // Check if the user exists
        const user = await User.findOne({ email });
        const isExists = !!user;

        // Generate a JWT token if the user exists
        const payload = {
            user: {
                email: email,
                id: user ? user.id : null // Use user's ID if they exist, else null
            },
        };

        // Sign the JWT token
        const token = await new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '30d' }, // Token expires in 21 hours
                (err, signedToken) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(signedToken);
                    }
                }
            );
        });

        // Send response with all required data
        res.status(200).json({
            success: true,
            statusCode: 200,
            msg: 'OTP verified successfully',
            isExists,
            token,
            data: isExists ? user : { email }
        });
    } catch (err) {
        console.error('Error in verifyOtp:', err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error while verifying OTP'
        });
    }
};



// Register a new user
exports.registerUser = async (req, res) => {
    const { name, email } = req.body; // Only require name and email

    try {
        // Create new user without any checks
        const user = new User({
            name,
            email
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
            { expiresIn: '30d' }, 
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
    const { name, phoneNumber } = req.body;

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

exports.deleteUser = async (req, res) => {
    try {
        // Get the userId from query params
        let userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                msg: 'User ID is required',
            });
        }

        // Check if user exists
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                msg: 'User not found',
            });
        }

        // Remove all notes related to the user
        await Note.deleteMany({ userId: user.id });

        // Remove all tags related to the user
        await Tag.deleteMany({ userId: user.id });

        // Delete the user using findByIdAndDelete
        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            statusCode: 200,
            msg: 'User and all related data deleted successfully',
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

