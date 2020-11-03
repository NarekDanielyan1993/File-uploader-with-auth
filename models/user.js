const bcrypt = require('bcryptjs')
const { password } = require('../config/config')
const createError = require('http-errors')
require('dotenv').config()

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            emailOrPhoneNumber: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
        },
        {
            defaultScope: {
                attributes: { exclude: ['password'] },
            },
            scopes: {
                withPassword: {
                    attributes: {},
                },
            },
        }
    )

    User.beforeCreate(async (user) => {
        bcrypt.genSalt(+process.env.SALT_LENGTH, function (err, salt) {
            if (err) {
                console.log(err.message)
                Promise.reject(createError.InternalServerError())
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    console.log(err)
                    Promise.reject(createError.InternalServerError())
                }
                user.password = hash
            })
        })
    })

    User.prototype.validatePassword = async function (password) {
        return await bcrypt.compare(password, this.password)
    }

    return User
}
