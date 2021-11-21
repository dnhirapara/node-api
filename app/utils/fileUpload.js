const multer = require("multer");

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const multerIns = multer({
    storage: storage,
    limits: {
        fileSize: 1000000,
    },
    fileFilter: function chkFileExtension(req, file, cb) {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
        const mimeType = fileTypes.test(file.mimetype);
        if (mimeType && extname) {
            return cb(null, true);
        } else {
            cb("Error: Images only!!")
        }
    },
})

module.exports = multerIns;