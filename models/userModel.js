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
    date: {
        type: Date,
        default: Date.now,  // Automatically set the date when the user is created
    },
    subscriptionPlanStatus: {
        type: String,
        enum: ['active', 'inactive', 'expired'],  // Possible statuses: 'active', 'inactive', or 'expired'
        default: 'inactive',  // Default value
    },
    collaboratedMembers: [{
        type: mongoose.Schema.Types.ObjectId,  // Reference to other User documents
        ref: 'User',  // Reference to the User model
    }],
});

// Virtual field to return a message when there are no collaborations
UserSchema.virtual('collaborationStatus').get(function() {
    return this.collaboratedMembers.length === 0 ? 'No collaboration yet' : 'Collaborations available';
});

// To include the virtual field in the JSON output
UserSchema.set('toJSON', {
    virtuals: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
