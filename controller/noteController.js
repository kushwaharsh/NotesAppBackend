const { default: mongoose } = require("mongoose");
const Notes = require("../models/notesModel");
const { validationResult } = require("express-validator");






// Create a new note
exports.createNote = async (req, res) => {
  console.log("API hit");
  const { title, content, tag, isBookmarked, whiteboard, noteDeadline, userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "User ID is required",
    });
  }

  try {
    const newNote = new Notes({
      title,
      content,
      tag,
      isBookmarked,
      whiteboard,
      noteDeadline,
      userId,
    });
    await newNote.save();
    res.status(201).json({
      success: true,
      statusCode: 200,
      msg: "Note created successfully",
      note: newNote,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      statusCode: 500,
      msg: "Server error",
    });
  }
};

// Get all notes for a specific user
exports.getAllNotes = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "User ID is required",
    });
  }

  try {
    const notes = await Notes.find({ userId }).sort({ dateCreated: -1 });
    res.status(200).json({
      success: true,
      statusCode: 200,
      notes,
      count: notes.length,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      statusCode: 500,
      msg: "Server error",
    });
  }
};

// Get a specific note by ID for a specific user
exports.getNoteById = async (req, res) => {
  const { userId, id } = req.query;

  if (!userId || !id) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "User ID and Note ID are required",
    });
  }

  try {
    const note = await Notes.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        msg: "Note not found",
      });
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      note,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      statusCode: 500,
      msg: "Server error",
    });
  }
};

// Update a note by ID for a specific user
exports.updateNote = async (req, res) => {
  const { title, content, tag, isBookmarked, whiteboard, userId } = req.body;
  const { id } = req.query;

  if (!id || !userId) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "Note ID and User ID are required",
    });
  }

  if (!title) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "Title is required and cannot be null",
    });
  }

  if (content && whiteboard) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "Either content or whiteboard must be provided, but not both",
    });
  }

  if (!content && !whiteboard) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "Either content or whiteboard must be present",
    });
  }

  try {
    let note = await Notes.findOne({ _id: id, userId });
    if (!note) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        msg: "Note not found",
      });
    }

    note.title = title;
    if (content !== undefined) note.content = content;
    if (whiteboard !== undefined) note.whiteboard = whiteboard;
    if (tag !== undefined) note.tag = tag;
    if (isBookmarked !== undefined) note.isBookmarked = isBookmarked;

    await note.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      msg: "Note updated successfully",
      note,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      statusCode: 500,
      msg: "Server error",
    });
  }
};

// Delete a note by ID for a specific user
exports.deleteNote = async (req, res) => {
  const { userId, id } = req.query;

  if (!id || !userId) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "Note ID and User ID are required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      msg: "Invalid note ID",
    });
  }

  try {
    const note = await Notes.findOneAndDelete({ _id: id, userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        msg: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      msg: "Note removed successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      statusCode: 500,
      msg: "Server error",
    });
  }
};
