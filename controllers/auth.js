const {validationResult} = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const { User } = require("../models")
const errorFormat = require("../util/expressValidationErrorFormat")
const { signRefreshToken, verifyRefreshToken, signAccessToken, verifyAccessToken } = require("../util/jwt")
const client = require("../util/redis")


exports.signup = (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormat)
    if(!errors.isEmpty()) {
        const error = new Error("Validation failed")
        error.statusCode = 422;
        error.message = errors.array()
        return next(error);                                  
    }                                                            
    const emailOrPhoneNumber = req.body.emailOrPhoneNumber;
    User.findOne({where:{emailOrPhoneNumber}})
    .then(user => {
        if(user) {
            const error = new Error("Email or phone number already in use")
            error.statusCode = 422;
            next(error)
        }
    })
    .catch(err => next(next(err)))
    const password = req.body.password;                             
    bcrypt.genSalt(+process.env.SALT_LENGTH, function(err, salt) {
        if(err) {
            console.log(err)
            return next(err);
        }
        bcrypt.hash(password, salt, function(err, hash) {
            if(err) {
                console.log(err)
                return next(err);
            }
            User.create({
                emailOrPhoneNumber,
                password: hash
            })
            .then(user => {
                res.status(200).json({message: "You Successfully signup", data: user.id})

            })
            .catch(err => next(err))

        })
    })
}

exports.login = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormat)
    if(!errors.isEmpty()) {
        const error = new Error("Validation failed")
        error.statusCode = 422;
        error.message = errors.array()
        console.log(error.message)
        return next(error);                                  
    }  
    const emailOrPhoneNumber = req.body.emailOrPhoneNumber;
    const password = req.body.password;
    const user = await User.findOne({where: {emailOrPhoneNumber}})
        if(!user) {
            const error = new Error("User not found")
            error.statusCode = 401;
            return next(error)
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            const error = new Error("Password does not correct")
            error.statusCode = 401;
            return next(error)
        }
        const token = await signAccessToken(user.id)
        const refreshToken = await signRefreshToken(user.id)
        res.status(200).json({message: "Success", token: token, refreshToken})
}

exports.refreshToken = async (req, res, next) => {
    let  { refreshToken } = req.body;
    if(!refreshToken) {
        const err = new Error("Token not found")
        err.statusCode = 400;
        return next(err)
    }
    const user = await verifyRefreshToken(refreshToken);
    const token = await signAccessToken(user.id)
    refreshToken = await signRefreshToken(user.id)
    res.status(200).json({message: "Success", token: token, refreshToken})
    
}

exports.logout = async (req, res, next) => {
    let token = req.headers.authorization;
    if(!token) {
        const error = new Error("No credentials sent!")
        error.statusCode = 401;
        return next(error);
       
    } 
    token = token.split(" ")[1] 
    if(!token) {
        const error = new Error("Authorization failed")
        error.statusCode = 401;
        return next(error);
    } 
    try {
        const payload = await verifyAccessToken(token)
        .catch(err => {
            return next(err)
        })
        client.DEL(payload.id, (err, val) => {
            if(err) {
                console.log(err.message)
                return next(err)
            }
            if(!val) {
                res.status(201).json({message: "User already logged out"})
            }
            res.status(201).json({message: "User successfully logged out"})
        })
    } catch(err) {
        return next(err)
    }
}