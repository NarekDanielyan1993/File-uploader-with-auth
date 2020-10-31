const JWT = require('jsonwebtoken')
const client = require("./redis")

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const secret = process.env.JWT_SECRET_KEY
            const options = {
              id: userId,
          }
            JWT.sign( options, secret, {expiresIn: '600s'}, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(err)
                }
                client.SET(userId, token, "EX", 365 * 24 * 60 * 60, (err, reply) => {
                    if(err) {
                        console.log(err.message)
                        reject(err)
                        return;
                    }
                    resolve(token)
                })
            })
        })
    },
    verifyAccessToken: (token) => {
        return new Promise((resolve, reject) => {
            JWT.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(payload);
            })
        })
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, payload) => {
                    if (err) return reject(err)
                    resolve(payload)
                }
            )
        })
    },
    signRefreshToken: ( id ) => {
        return new Promise((resolve, reject) => {
            const secret = process.env.REFRESH_TOKEN_SECRET;

            JWT.sign({id}, secret, {
                expiresIn: "1y"
            }, (err, token) => {
                if(err) reject(err)
                resolve(token)
            })
        })
        
    }
}