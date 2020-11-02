const JWT = require('jsonwebtoken')
const client = require('./redis')
const createError = require('http-errors')
const { Result } = require('express-validator')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const options = {
                id: userId,
            }
            JWT.sign(
                options,
                process.env.JWT_SECRET_KEY,
                { expiresIn: '600s' },
                (err, token) => {
                    if (err) {
                        console.log(err.message)
                        reject(createError.InternalServerError())
                        return
                    }
                    resolve(token)
                }
            )
        })
    },
    verifyAccessToken: (token) => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.Unauthorized())
                    return
                }
                resolve(payload)
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, payload) => {
                    if (err) {
                        console.log(err.message)
                        reject(createError.Unauthorized())
                        return
                    }
                    client.GET(payload.id, (err, result) => {
                        if (err) {
                            console.log(err.message)
                            reject(createError.InternalServerError())
                            return
                        }
                        if (refreshToken === result) {
                            resolve(payload)
                        }
                        reject(createError.Unauthorized())
                        return
                    })
                }
            )
        })
    },
    signRefreshToken: (id) => {
        return new Promise((resolve, reject) => {
            JWT.sign(
                { id },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: '1y',
                },
                (err, token) => {
                    if (err) {
                        console.log(err.message)
                        reject(createError.Unauthorized())
                        return
                    }
                    client.SET(
                        id,
                        token,
                        'EX',
                        365 * 24 * 60 * 60,
                        (err, reply) => {
                            if (err) {
                                console.log(err.message)
                                reject(createError.InternalServerError())
                                return
                            }
                        }
                    )
                    resolve(token)
                }
            )
        })
    },
}
