import * as express from "express";
import {postImage, deleteImage} from '@src/controllers/cloudinary-controller';
import upload from "@src/middlewares/multer";

const router: express.Router = express.Router();



router.post('/upload', upload.single('file'), postImage);
router.delete('/delete/:id', deleteImage);

export default router