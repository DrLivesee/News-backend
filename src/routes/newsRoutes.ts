import * as express from "express";

import {
  deleteNews,
  getNews,
  getNewsById,
  patchNews,
  postNews,
} from "@src/controllers/news-controller";

import { getCommentsForNews } from "@src/controllers/comments-controller";

const router: express.Router = express.Router();

//Post Method
router.post("/", postNews);

//Get all Method
router.get("/", getNews);

//Get comments for news
router.get("/:newsId/comments", getCommentsForNews);

//Get by ID Method
router.get("/:id", getNewsById);

//Update by ID Method
router.patch("/:id", patchNews);

//Delete by ID Method
router.delete("/:id", deleteNews);

export default  router ;
