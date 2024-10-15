const { default: mongoose } = require('mongoose');
const Notes = require('../models/notesModel');
const { validationResult } = require('express-validator');

// Create a new note
exports.createNote = async (req, res) => {
    console.log("API hit");
    const { title, content } = req.body;

    // const errors = validationResult(req);
 
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ 
    //         success: false,
    //         statusCode: 400,
    //         errors: errors.array() 
    //     });
    // }

    try {
        const newNote = new Notes({ title, content });
        await newNote.save();
        res.status(201).json({ 
            success: true,
            statusCode: 201,
            msg: 'Note created successfully',
            note: newNote 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};

// Get all notes for a user
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.find().sort({ dateCreated: -1 });

        res.status(200).json({ 
            success: true,
            statusCode: 200,
            notes,
            count :notes.length 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};

// Get a specific note by ID
exports.getNoteById = async (req, res) => {
    try {
        const note = await Notes.findById(req.query.id);
        if (!note) {
            return res.status(404).json({ 
                success: false,
                statusCode: 404,
                msg: 'Note not found' 
            });
        }
        res.status(200).json({ 
            success: true,
            statusCode: 200,
            note 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};

// Update a note by ID
exports.updateNote = async (req, res) => {
    const { title, content } = req.body;
  const {id} = req.query
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            statusCode: 400,
            errors: errors.array() 
        });
    }

    try {
        let note = await Notes.findById(id);
        if (!note) {
            return res.status(404).json({ 
                success: false,
                statusCode: 404,
                msg: 'Note not found' 
            });
        }

        if (title) note.title = title;
        if (content) note.content = content;

        await note.save();
        res.status(200).json({ 
            success: true,
            statusCode: 200,
            msg: 'Note updated successfully',
            note 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
    try {
        const noteId = req.query.id;

        // Check if the id is provided
        if (!noteId) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                msg: 'Note ID is required'
            });
        }

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                msg: 'Invalid note ID'
            });
        }

        const objId = new mongoose.Types.ObjectId(noteId);

        // Find and delete the note
        const note = await Notes.findByIdAndDelete(objId);
        
        if (!note) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                msg: 'Note not found'
            });
        }

        return res.status(200).json({
            success: true,
            statusCode: 200,
            msg: 'Note removed successfully'
        });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};