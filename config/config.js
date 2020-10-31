require("dotenv").config()

const config = {
  development: {
      username: process.env.NAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      host: process.env.HOST,
      dialect: "mysql"
  }
}

module.exports = config.development
