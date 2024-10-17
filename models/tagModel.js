const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    tag: {
        type: String, // Define the type explicitly for 'tag'
        required: true, // 'required' is part of the options for the 'tag' field
        unique: true, // Ensures that each tag is unique
        trim: true
    },
    userId : {
        type : mongoose.Types.ObjectId,
        required : true
    }
}, 
{
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create and export the Tag model
const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;
