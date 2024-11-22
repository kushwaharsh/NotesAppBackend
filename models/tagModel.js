const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag: {
        type: String, // Define the type explicitly for 'tag'
        required: true, // 'required' is part of the options for the 'tag' field
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, 
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Add unique constraint on combination of tag and userId
tagSchema.index({ tag: 1, userId: 1 }, { unique: true });

// Create and export the Tag model
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
