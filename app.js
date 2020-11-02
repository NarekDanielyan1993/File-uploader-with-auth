const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const dotenv = require('dotenv')
const path = require('path')
const db = require('./models')
dotenv.config()

//routes
const authRoute = require('./routers/auth')
const userRoute = require('./routers/user')
const fileRoute = require('./routers/upload')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/images', express.static(path.join(__dirname, '/images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Methods',
        'PUT,GET,POST,PATCH,DELETE, OPTIONS'
    )
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With'
    )
    next()
})

app.use('/auth', authRoute)
app.use(userRoute)
app.use('/file', fileRoute)

//error middleware
app.use((error, req, res, next) => {
    let status = error.statusCode || 500
    let message =
        error.statusCode === '500'
            ? 'There is something wrong with server'
            : error.message
    res.status(status).json({ message: message })
})

db.sequelize
    .authenticate()
    .then(() => {
        app.listen(3001, () => console.log(`server listening at port ${3001}`))
    })
    .catch((err) => {
        console.log(err)
    })
