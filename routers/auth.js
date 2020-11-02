const express = require('express')
const router = express.Router()
const { body, oneOf, check } = require('express-validator')

const authController = require('../controllers/auth')
const isMobilePhoneNumber = require('../util/isMobilePhoneNumber')
const isAuth = require('../middleware/isAuth')

router.put(
    '/signup',
    oneOf(
        [
            check('emailOrPhoneNumber').isEmail(),
            check('emailOrPhoneNumber').custom((value) => {
                if (!isMobilePhoneNumber(value)) {
                    throw new Error()
                }
                return true
            }),
        ],
        'please enter valid email or phone number'
    ),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .custom((value, { req }) => {
            if (value !== req.body.passwordConformation) {
                throw new Error('Password conformation is incorrect')
            }
            return true
        }),
    authController.signup
)

router.post(
    '/signin',
    oneOf(
        [
            check('emailOrPhoneNumber').exists().normalizeEmail().isEmail(),
            check('emailOrPhoneNumber').custom((value) => {
                if (!isMobilePhoneNumber(value)) {
                    throw new Error()
                }
                return true
            }),
        ],
        'please enter valid email or phone number'
    ),
    body('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long.'),
    authController.login
)

router.post('/signin/new_token', authController.refreshToken)

router.get('/logout', isAuth, authController.logout)

module.exports = router
