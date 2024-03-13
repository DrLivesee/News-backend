const express = require("express");

const {
  getNews,
  postNews,
  getNewsById,
  patchNews,
  deleteNews,
} = require("../controllers/news-controller");

const { getCommentsForNews } = require("../controllers/comments-controller");

const router = express.Router();

module.exports = router;

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
