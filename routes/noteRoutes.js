const express = require('express');
const {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    createTag
} = require('../controller/noteController');
const { validateCreateNote, validateUpdateNote, verifyToken } = require('../middleware/noteMiddleware');

const router = express.Router();

// Endpoint to create a new note
router.post('/newNote', verifyToken, validateCreateNote, createNote); // createNote

// Endpoint to get all notes
router.get('/getAllnote', verifyToken, getAllNotes); // getAllNotes

// Endpoint to get a specific note by ID
router.get('/noteById', verifyToken, getNoteById); // getNoteById

// Endpoint to update a note by ID
router.post('/updateNote', verifyToken, validateUpdateNote, updateNote); // updateNote

// Endpoint to delete a note by ID
router.delete('/delete', verifyToken, deleteNote); // deleteNote


module.exports = router;
