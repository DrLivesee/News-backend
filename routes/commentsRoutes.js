const express = require("express");

const {
    getComments,
    postComment,
    getCommentById,
    patchComment,
    deleteComment
    
} = require("../controllers/comments-controller");

const router = express.Router();

module.exports = router;

//Post Method
router.post("/", postComment);

//Get all Method
router.get("/", getComments);


//Get by ID Method
router.get("/:id", getCommentById);

//Update by ID Method
router.patch("/:id", patchComment);

//Delete by ID Method
router.delete("/:id", deleteComment);
