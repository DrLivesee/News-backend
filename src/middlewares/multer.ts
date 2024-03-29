import multer from 'multer';


const storage: multer.StorageEngine = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

const upload: multer.Multer = multer({ storage: storage })

export default upload;