const express = require('express');
const multer = require('multer');

const passportUsage = require('../authentication/passport-usage');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    } 
    cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadImage = express.Router();

uploadImage.use(express.json());

uploadImage.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.post(cors.corsWithOptions, passportUsage.verifyAdmin, upload.single('imageFile'), (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})

module.exports = uploadImage;