

const mongoose = require('mongoose');


// Create User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Name is required
    },
    email: {
        type: String,
        required: true,  // Email is required
        unique: true,    // Email should be unique
    },
    password: {
        type: String,
        required: true,  // Password is required
    },
    date: {
        type: Date,
        default: Date.now,  // Automatically set the date when user is created
    },
});

const User = mongoose.model('User', UserSchema);

module.exports = User; 