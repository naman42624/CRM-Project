const multer = require("multer");

// upload avatar
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
            return cb(new Error("Please upload an image file"));
        }
        cb(undefined, true);
    }
});

module.exports = upload;