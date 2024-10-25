const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db/connection'); // Updated path
const dotenv = require('dotenv');
const cors = require("cors");

const notesRouter = require("./routes/noteRoutes")
const tagRoutes = require('./routes/tagRoutes');
// Load environment variables
require('dotenv').config()

// Check required environment variables
if (!process.env.JWT_SECRET || !process.env.PORT || !process.env.DB_URI) {
    console.error("Missing required environment variables. Check your .env file.");
    process.exit(1);
}

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB()
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    });

app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/tags', require('./routes/tagRoutes'));

// Handle non-existent routes
app.use((req, res, next) => {
    res.status(404).json({ msg: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        statusCode: 500,
        msg: "Server error",
    });
});

// Define Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
