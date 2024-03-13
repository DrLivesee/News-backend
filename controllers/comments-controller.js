const Comment = require("../models/commentModel");

async function getComments(req, res) {
  try {
    let comments = await Comment.find();

    let totalDocuments = await Comment.countDocuments();

    res.json({ comments, totalDocuments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCommentsForNews(req, res) {
    const newsId = req.params.newsId;
  
    try {
      let comments = await Comment.find({ newsId });

      if (req.query.sort === "createdAt") {
        comments = comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

async function postComment(req, res) {
  const data = new Comment({
    name: req.body.name,
    avatar: req.body.avatar,
    text: req.body.text,
    userId: req.body.userId,
    newsId: req.body.newsId,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getCommentById(req, res) {
  try {
    const data = await Comment.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function patchComment(req, res) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Comment.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteComment(req, res) {
  try {
    const id = req.params.id;
    await Comment.findByIdAndDelete(id);
    res.send(`Comment with ID ${id} has been deleted.`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getComments,
  postComment,
  getCommentById,
  patchComment,
  deleteComment,
  getCommentsForNews
};
