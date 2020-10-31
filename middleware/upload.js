const multer = require("multer");



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "images");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
  
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype.startsWith("image")
    ) {
        return cb(null, true);
    }
    return cb(null, false);
};

const uploadFile = multer({ storage: storage, fileFilter: fileFilter });

module.exports = uploadFile;