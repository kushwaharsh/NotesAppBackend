const { default: mongoose } = require('mongoose');
const { validationResult } = require('express-validator');
const Tags = require('../models/tagModel');

// Create a new tag
exports.createTag = async (req, res) => {
    const { tag  , userId} = req.body;
    
    try {
        const newTag = new Tags({ tag , userId });
        await newTag.save();
        
        res.status(201).json({
            success: true,
            statusCode: 200,
            msg: 'Tag created successfully',
            label: newTag
        });
    } catch (err) {
        console.error(err.message);
        
        // Check if it's a duplicate key error
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                msg: 'Tag already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};

// Update an existing tag
exports.updateTag = async (req, res) => {
    const id = req.query.id;
    const { tag , userId } = req.body;
    
    try {
        let updatedTag = await Tags.findByIdAndUpdate(
            id,
            { tag , userId },
            { new: true }
        );
        
        if (!updatedTag) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                msg: 'Tag not found'
            });
        }
        
        res.status(200).json({
            success: true,
            statusCode: 200,
            msg: 'Tag updated successfully',
            label: updatedTag
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

// Delete a tag
exports.deleteTag = async (req, res) => {
    const id  = req.query.id;
    
    try {
        const deletedTag = await Tags.findByIdAndDelete(id);
        
        if (!deletedTag) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                msg: 'Tag not found'
            });
        }
        
        res.status(200).json({
            success: true,
            statusCode: 200,
            msg: 'Tag deleted successfully',
            label: deletedTag
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

// Get all tags
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tags.find({userId});
        
        res.status(200).json({
            success: true,
            statusCode: 200,
            msg: 'Tags retrieved successfully',
            labels: tags
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
