// models/notesModel.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Notes schema
const noteSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
  },
  whiteboard: {
    type: String,
  },
  tag : {
    type: String,
    default : "All"
  },
  isBookmarked : {
    type: Boolean,
    default : false
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
     
  },
},{timestamps:true});

// Middleware to set `lastModified` date before saving
noteSchema.pre('save', function (next) {
  this.lastModified = Date.now();
  next();
});

// Create and export the Notes model
const Notes = mongoose.model('Notes', noteSchema);

module.exports = Notes;
