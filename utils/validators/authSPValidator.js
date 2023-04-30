const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');
const User = require('../../models/authmodel');

exports.signupValidator = [
check('serviceName').not().isEmpty().withMessage('serviceName is required'),
check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        User.findOne({ email: val }).then((user) => {
        if (user) {
            return Promise.reject('E-mail already in user');
        }
    })
    ),
check('phoneNumber')
    .notEmpty()
    .withMessage('phone number required')
    .isMobilePhone()
    .withMessage("Invalid format"),
check('Address')
    .not().isEmpty()
    .withMessage('Address is required'),
check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
    }
        return true;
    }),

check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),
check("category")
    .notEmpty()
    .withMessage('category is  required'),

validatorMiddleware,
];

exports.loginValidator = [
check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address'),

check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

validatorMiddleware,
];
