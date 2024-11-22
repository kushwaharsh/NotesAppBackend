const express = require('express');
const router = express.Router();
const tagController = require('../controller/tagController');

const {verifyToken } = require('../middleware/noteMiddleware');


// Route to create a new tag
router.post('/createTag', tagController.createTag);

// Route to update an existing tag by ID
router.post('/updateTag', tagController.updateTag);

// Route to delete a tag by ID
router.delete('/deleteTag/:id', tagController.deleteTag);

// Route to get all tags
router.get('/getAllTags', verifyToken , tagController.getAllTags);

module.exports = router;
