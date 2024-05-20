import * as express from "express";

import {
  getComments,
  postComment,
  getCommentById,
  patchComment,
  patchComments,
  deleteComment
} from "@src/controllers/comments-controller";

const router: express.Router = express.Router();

//Post Method
router.post("/", postComment);

//Get all Method
router.get("/", getComments);

//Get by ID Method
router.get("/:id", getCommentById);

//Update by ID Method
router.patch("/:id", patchComment);

router.patch("/bulk-update", patchComments);

//Delete by ID Method
router.delete("/:id", deleteComment);

export default router