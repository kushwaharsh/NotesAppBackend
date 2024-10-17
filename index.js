const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db/connection'); // Updated path
const dotenv = require('dotenv');
const cors = require("cors")

const notesRouter = require("./routes/noteRoutes")
const tagRoutes = require('./routes/tagRoutes');
// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

app.use(cors())
// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', notesRouter);
app.use('/api/tags', tagRoutes )

// Define Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
