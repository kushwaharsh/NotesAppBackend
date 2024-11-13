const { default: mongoose } = require('mongoose');
const { validationResult } = require('express-validator');
const Tags = require('../models/tagModel');
const Notes = require('../models/notesModel');

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
// exports.getAllTags = async (req, res) => {
//     const { userId } = req.query;

//     try {
//         // Fetch all tags for the user
//         let tags = await Tags.find({ userId });

//         // Check if "All" tag exists
//         let allTag = tags.find(tag => tag.tag === "All");
//         if (!allTag) {
//             // Create "All" tag if missing
//             allTag = new Tags({ tag: "All", userId });
//             await allTag.save();
//             tags = [allTag, ...tags]; // Add "All" tag at the beginning of the list
//         }

//          // Check if "All" tag exists
//          let finishedTag = tags.find(tag => tag.tag === "Finished");
//          if (!finishedTag) {
//              // Create "All" tag if missing
//              finishedTag = new Tags({ tag: "Finished", userId });
//              await finishedTag.save();
//              tags = [...tags , finishedTag]; // Add "All" tag at the beginning of the list
//          }

//         if (tags.length) {
//             res.status(200).json({
//                 success: true,
//                 statusCode: 200,
//                 msg: 'Tags retrieved successfully',
//                 labels: tags
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 statusCode: 400,
//                 msg: 'No tags found',
//             });
//         }
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({
//             success: false,
//             statusCode: 500,
//             msg: 'Server error'
//         });
//     }
// };


// exports.getAllTags = async (req, res) => {
//     const { userId } = req.query;

//     try {
//         // Fetch all tags for the user
//         let tags = await Tags.find({ userId });

//         // Check if "All" tag exists
//         let allTag = tags.find(tag => tag.tag === "All");
//         if (!allTag) {
//             // Create "All" tag if missing
//             allTag = new Tags({ tag: "All", userId });
//             await allTag.save();
//             tags = [allTag, ...tags]; // Add "All" tag at the beginning of the list
//         }

//         // Check if "Finished" tag exists
//         let finishedTag = tags.find(tag => tag.tag === "Finished");
//         if (!finishedTag) {
//             // Create "Finished" tag if missing
//             finishedTag = new Tags({ tag: "Finished", userId });
//             await finishedTag.save();
//             tags = [...tags, finishedTag]; // Add "Finished" tag at the end of the list
//         }

//         // Iterate through each tag to check if it has an attached note
//         const validTags = [];
//         for (const tag of tags) {
//             // Check if any notes exist with the current tag
//             const attachedNotes = await Notes.find({ tag: tag.tag, userId });

//             if (attachedNotes.length > 0) {
//                 // Include tags that have attached notes
//                 validTags.push(tag);
//             } else {
//                 // Delete the tag if no notes are attached
//                 await Tags.findByIdAndDelete(tag._id);
//             }
//         }

//         if (validTags.length) {
//             res.status(200).json({
//                 success: true,
//                 statusCode: 200,
//                 msg: 'Tags retrieved successfully',
//                 labels: validTags
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 statusCode: 400,
//                 msg: 'No tags found',
//             });
//         }
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({
//             success: false,
//             statusCode: 500,
//             msg: 'Server error'
//         });
//     }
// };


exports.getAllTags = async (req, res) => {
    const { userId } = req.query;

    try {
        // Fetch all tags for the user
        let tags = await Tags.find({ userId });

        // Check if "All" tag exists
        let allTag = tags.find(tag => tag.tag === "All");
        if (!allTag) {
            // Create "All" tag if missing
            allTag = new Tags({ tag: "All", userId });
            await allTag.save();
            tags = [allTag, ...tags]; // Add "All" tag at the beginning of the list
        }

        // Check if "Finished" tag exists
        let finishedTag = tags.find(tag => tag.tag === "Finished");
        if (!finishedTag) {
            // Create "Finished" tag if missing
            finishedTag = new Tags({ tag: "Finished", userId });
            await finishedTag.save();
            tags = [...tags, finishedTag]; // Add "Finished" tag at the end of the list
        }

        // Iterate through each tag to check if it has an attached note
        const validTags = [];
        for (const tag of tags) {
            // Check if any notes exist with the current tag
            const attachedNotes = await Notes.find({ tag: tag.tag, userId });

            if (attachedNotes.length > 0 || tag.tag === "All" || tag.tag === "Finished") {
                // Include tags that have attached notes or are the "All" or "Finished" tags
                validTags.push(tag);
            } else {
                // Delete the tag if no notes are attached and it's not "All" or "Finished"
                await Tags.findByIdAndDelete(tag._id);
            }
        }

        // Ensure "All" tag is at the beginning and "Finished" tag is at the end
        const finalTags = [
            validTags.find(tag => tag.tag === "All"), // "All" tag first
            ...validTags.filter(tag => tag.tag !== "All" && tag.tag !== "Finished"), // Other tags
            validTags.find(tag => tag.tag === "Finished") // "Finished" tag last
        ].filter(Boolean); // Remove any undefined tags just in case

        if (finalTags.length) {
            res.status(200).json({
                success: true,
                statusCode: 200,
                msg: 'Tags retrieved successfully',
                labels: finalTags
            });
        } else {
            res.status(400).json({
                success: false,
                statusCode: 400,
                msg: 'No tags found',
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            statusCode: 500,
            msg: 'Server error'
        });
    }
};



