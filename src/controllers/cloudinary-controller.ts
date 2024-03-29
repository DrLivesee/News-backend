
import cloudinary from "@src/utils/cloudinary";

import { Request, Response } from 'express';

 async function postImage (req: Request, res: Response): Promise<void> {
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

export { postImage }