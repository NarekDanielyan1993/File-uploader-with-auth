const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()
const createError = require('http-errors')

module.exports = (req, res, next) => {
    let token = req.headers.authorization
    if (!token) {
        return next(createError.Forbidden('No credentials sent!'))
    }
    token = token.split(' ')[1]
    if (!token) {
        return next(createError.Forbidden('Authorization failed'))
    }
    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
    } catch (err) {
        throw createError.Unauthorized()
    }
    req.userId = decodedToken.id
    next()
}
