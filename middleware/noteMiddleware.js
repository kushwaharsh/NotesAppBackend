const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Middleware to validate note creation
exports.validateCreateNote = [
    check('title', 'Title is required').not().isEmpty(),
   // check('content', 'Content is required').not().isEmpty(),
    // check('userId', 'User ID is required').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Middleware to validate note update
exports.validateUpdateNote = [
    check('title', 'Title is required').optional().not().isEmpty(),
    //check('content', 'Content is required').optional().not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// Middleware to check for authentication (optional)
// exports.verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     console.log("token=>",token)
//     if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded.user; // Attach user information to the request
//         next();
//     } catch (err) {
//         res.status(401).json({ msg: 'Token is not valid' });
//     }
// };

exports.verifyToken = (req, res, next) => {
    // Get token from Authorization header
  
    
    let token = req.header('Authorization');
    console.log("token=>", token);

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Remove "Bearer " from the token string if it starts with it
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Remove 'Bearer ' from the token
    }

    try {
        // Verify token and extract user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Attach user information to the request
        next();
    } catch (err) {
        res.status(401).json({ status: false, statusCode: 401, msg: 'Token is not valid' , comment : 'may be security logout' });
    }
};

