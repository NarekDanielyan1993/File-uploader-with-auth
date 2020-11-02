const express = require('express')

const router = express.Router()
const upload = require('../middleware/upload')

//controllers
const fileController = require('../controllers/file')

//middlewares
const isAuth = require('../middleware/isAuth')

router.post(
    '/upload',
    isAuth,
    upload.single('image'),
    fileController.uploadFiles
)

router.get('/list', isAuth, fileController.getImages)

router.delete('/delete/:id', isAuth, fileController.deleteImage)

router.put(
    '/update/:id',
    isAuth,
    upload.single('image'),
    fileController.updateImage
)

router.get('/:id', fileController.getImageById)

module.exports = router
