const { body, validationResult } = require('express-validator');

const authorBodyParams = [

    body('name')
    .notEmpty()
    .isString()
    .withMessage('Name is required end must be a string'),

    body('surname')
    .notEmpty()
    .isString()
    .withMessage('Surname is required end must be a string'),

    body('email')
    .notEmpty()
    .isEmail()
    .withMessage('Email is required end must include the @ character'),

    body('password')
    .notEmpty()
    .isString()
    .withMessage('Password is required end must be a string'),

    body('dateOfBirth')
    .notEmpty()
    .isString()
    .withMessage('Date of birth is required end must be a string'),

    body('avatar')
    .notEmpty()
    .isURL()
    .withMessage('Avatar is required end must be a URl'),

];

const validateAuthorBody = (req,res,next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    next()
};

module.exports = { authorBodyParams, validateAuthorBody };