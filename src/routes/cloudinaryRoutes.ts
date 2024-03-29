import * as express from "express";
import {postImage} from '@src/controllers/cloudinary-controller';
import upload from "@src/middlewares/multer";

const router: express.Router = express.Router();


router.post('/', upload.single('file'), postImage);


export default router