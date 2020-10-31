const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()
const client = require("../util/redis")

module.exports = (req, res, next) => {
    let token = req.headers.authorization;
    if(!token) {
        const error = new Error("No credentials sent!")
        
        error.statusCode = 401;
        throw error;
    } 
    token = token.split(" ")[1] 
    if(!token) {
        const error = new Error("Authorization failed")
        error.statusCode = 401;
        throw error;
    }                                                         
    try {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
            if(err) {
                const error = new Error("Not authenticated")
                error.statusCode = 401;
                throw error;
            }
            client.GET(payload.id, (err, val) => {
                if(err) {
                    const error = new Error("Not authenticated")
                    error.statusCode = 401;
                    return next(error);
                }
                req.userId = payload.id;
                next()
            })
        })
    } catch (err) {
        err.statusCode = 500;
        throw err;                                            
    }
}