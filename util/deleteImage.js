const path = require("path");
const fs = require("fs")

const removeImage = (path) => {
    fs.unlink(path, (err) => {
        if(err) throw err
    })
}

module.exports = removeImage;