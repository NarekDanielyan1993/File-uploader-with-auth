const bcrypt = require('bcryptjs')
const { password } = require('../config/config')
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
                throw createError.InternalServerError()
            }
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    console.log(err)
                    throw createError.InternalServerError()
                }
                user.password = password
            })
        })
    })

    User.prototype.validatePassword = async function (password) {
        return await bcrypt.compare(password, this.password)
    }

    return User
}
