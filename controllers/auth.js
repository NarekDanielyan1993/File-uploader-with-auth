const { validationResult } = require('express-validator')
const createError = require('http-errors')
const dotenv = require('dotenv')
dotenv.config()

const { User } = require('../models')
const errorFormat = require('../util/expressValidationErrorFormat')
const {
    signRefreshToken,
    verifyRefreshToken,
    signAccessToken,
} = require('../util/jwt')
const client = require('../util/redis')

exports.signup = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormat)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.statusCode = 422
        error.message = errors.array()
        return next(error)
    }
    const emailOrPhoneNumber = req.body.emailOrPhoneNumber
    const password = req.body.password
    User.findOne({ where: { emailOrPhoneNumber } })
        .then((user) => {
            if (user) {
                return next(
                    createError.BadRequest(
                        "'Email or phone number already in use'"
                    )
                )
            }
        })
        .catch((err) => next(err))
    User.create({
        emailOrPhoneNumber,
        password,
    })
        .then((user) => {
            if (!user) throw createError.InternalServerError()
            res.status(200).json({
                message: 'You Successfully signup',
                data: user.id,
            })
        })
        .catch((err) => next(err))
}

exports.login = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormat)
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed')
        error.statusCode = 422
        error.message = errors.array()
        console.log(error.message)
        return next(error)
    }
    const emailOrPhoneNumber = req.body.emailOrPhoneNumber
    const password = req.body.password
    const user = await User.scope('withPassword').findOne({
        where: { emailOrPhoneNumber },
    })
    if (!user) {
        next(createError.BadRequest('User not found'))
    }
    const isPasswordMatch = user.validatePassword(password)
    if (!isPasswordMatch) {
        next(createError.BadRequest('Password does not correct'))
    }
    let token
    let refreshToken
    try {
        token = await signAccessToken(user.id)
        refreshToken = await signRefreshToken(user.id)
    } catch (error) {
        next(error)
    }
    res.status(200).json({ message: 'Success', token: token, refreshToken })
}

exports.refreshToken = async (req, res, next) => {
    let { refreshToken } = req.body
    try {
        if (!refreshToken) {
            throw createError.BadRequest()
        }
        const user = await verifyRefreshToken(refreshToken)
        const token = await signAccessToken(user.id)
        const newRefreshToken = await signRefreshToken(user.id)
        res.status(200).json({
            message: 'Success',
            token: token,
            refreshToken: newRefreshToken,
        })
    } catch (err) {
        next(err)
    }
}

exports.logout = async (req, res, next) => {
    try {
        client.DEL(req.userId, (err, val) => {
            if (err) {
                console.log(err.message)
                throw createError.InternalServerError()
            }
            res.status(201).json({ message: 'User successfully logged out' })
        })
    } catch (err) {
        next(err)
    }
}
