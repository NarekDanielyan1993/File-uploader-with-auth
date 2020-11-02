const { Image } = require('../models')
const deleteImage = require('../util/deleteImage')
const { User } = require('../models')
const createError = require('http-errors')

exports.uploadFiles = async (req, res, next) => {
    const image = req.file
    if (!image) {
        next(createError.BadRequest('Image not found'))
    }

    const type = req.file.mimetype.split('/').pop()
    Image.create({
        name: image.originalname,
        type,
        imagePath: req.file.path,
        mime: image.mimetype,
        size: image.size,
        UserId: req.userId,
    })
        .then((image) => {
            res.status(201).json({ message: 'Image successfully stored.' })
        })
        .catch((err) => next(err))
}

exports.getImages = (req, res, next) => {
    const page = +req.query.page || 1
    const limit = +req.query.list_size || 10
    const offset = (page - 1) * limit
    Image.findAndCountAll({
        where: {
            UserId: req.userId,
        },
        include: { model: User },
        offset: offset,
        limit: limit,
    })
        .then((images) => {
            res.status(201).json({ message: 'success', images })
        })
        .catch((err) => next(err))
}

exports.deleteImage = (req, res, next) => {
    const id = req.params.id
    if (!id) {
        next(createError.BadRequest('Id not found'))
    }
    Image.findOne({
        where: {
            id,
        },
    })
        .then((image) => {
            if (!image) {
                throw createError.BadRequest('Image not found')
            }
            deleteImage(image.imagePath)
            return Image.destroy({
                where: {
                    id,
                },
            })
        })
        .then((image) => {
            res.status(201).json({ message: 'Image deleted successfully' })
        })
        .catch((err) => next(err))
}

exports.updateImage = (req, res, next) => {
    const id = req.params.id
    if (!id) {
        next(createError.BadRequest('Id not found'))
    }
    Image.findOne({
        where: {
            id,
        },
    })
        .then((image) => {
            if (!image) {
                throw createError.BadRequest('Image not found')
            }

            deleteImage(image.imagePath)
            const type = req.file.mimetype.split('/').pop()
            return Image.update(
                {
                    name: req.file.originalname,
                    type: type,
                    imagePath: req.file.path,
                    mime: req.file.mimetype,
                    size: req.file.size,
                },
                {
                    where: {
                        id,
                    },
                }
            )
        })
        .then((image) => {
            res.status(201).json({ message: 'image updated successfully' })
        })
        .catch((err) => next(err))
}

exports.getImageById = (req, res, next) => {
    const id = req.params.id
    Image.findOne({
        where: {
            id,
        },
    })
        .then((image) => {
            if (!image) {
                throw createError.BadRequest('Image not found')
            }
            res.status(201).json({ message: 'success', image })
        })
        .catch((err) => next(err))
}
