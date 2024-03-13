const express = require('express');
const cloudinaryController = require('../controllers/cloudinary-controller');
const upload = require("../middlewares/multer");

const router = express.Router();


router.post('/', upload.single('file'), cloudinaryController.postImage);


module.exports = router