
const cloudinary = require("../utils/cloudinary");

 async function postImage (req, res) {
  if (!req.file) return
  await cloudinary.uploader.upload(req.file.path, {folder: 'users'}, function (err, result){
    if(err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error"
      })
    }

    res.status(200).json({
      success: true,
      message:"Uploaded!",
      data: result
    })
  })
}

module.exports = {
    postImage
};