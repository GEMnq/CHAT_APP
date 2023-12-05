const { check } = require('express-validator');
// validator
const loginValidator = [
    check('email').notEmpty().withMessage('Please enter email field information')
                 .isEmail().withMessage('Email invalid'),
    check('password').notEmpty().withMessage('Please enter password field information')
                 .isLength({min: 3}).withMessage('Password contains at least 3 characters')
                 .isLength({max: 20}).withMessage('Password contains maximum of 20 characters'),
]
module.exports = loginValidator