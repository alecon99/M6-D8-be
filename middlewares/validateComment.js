const { body, validationResult } = require('express-validator');

const commentBodyParams = [

    body('author')
    .notEmpty()
    .isString()
    .withMessage('Author is required end must be a string'),

    body('title')
    .notEmpty()
    .isString()
    .withMessage('Title is required end must be a string'),

    body('content')
    .notEmpty()
    .isString()
    .isLength({ min: 5 })
    .withMessage('Content is required end must be at least 5 characters long'),

    body('rating')
    .notEmpty()
    .isNumeric()
    .withMessage('Rating is required end must be a number between 0 and 5'),

];

const validateCommentBody = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    next()
};

module.exports = { commentBodyParams, validateCommentBody };