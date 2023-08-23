const { body, validationResult } = require('express-validator');

const postBodyParams = [
    body('category')
    .notEmpty()
    .isString()
    .withMessage('Category is required end must be a string'),
    
    body('title')
    .notEmpty()
    .isString()
    .isLength({ min: 3 })
    .withMessage('Title is required end must be at least 3 characters long'),

    body('cover')
    .notEmpty()
    .isURL()
    .withMessage('Cover is required end must be a string'),

    body('readTime.value')
    .notEmpty()
    .isNumeric()
    .withMessage('Value is required end must be a number'),

    body('readTime.unit')
    .notEmpty()
    .isString()
    .equals( "minutes" )
    .withMessage('Unit is required end accept only minutes'),

    body('author')
    .notEmpty()
    .isString()
    .withMessage('Author is required end must be a string'),

    body('content')
    .notEmpty()
    .isString()
    .isLength({ min: 10 })
    .withMessage('Content is required end must be at least 10 characters long'),

];

 const validatePostBody = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    next()
};

module.exports = { postBodyParams, validatePostBody };