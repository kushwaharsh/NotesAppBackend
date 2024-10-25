const mongoose = require('mongoose');

// Create User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Name is required
        trim: true       // Remove extra spaces
    },
    email: {
        type: String,
        required: true,  // Email is required
        unique: true,    // Email should be unique
        lowercase: true, // Store email in lowercase
        trim: true,      // Remove extra spaces
        match: [
            /^\S+@\S+\.\S+$/, 
            'Please enter a valid email address' // Error message for invalid email
        ]
    },
    password: {
        type: String,
        required: true,  // Password is required
        minlength: 6     // Optional: set a minimum length
    },
    date: {
        type: Date,
        default: Date.now,  // Automatically set the date when the user is created
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
