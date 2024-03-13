const News = require("../models/newsModel");

async function getNews(req, res) {
  try {
    let query = {};

    if (req.query.searchQuery) {
      const searchQuery = req.query.searchQuery;

      const regex = new RegExp(searchQuery, "i");
  
      query = {
        $or: [
          { title: regex },
          { description: regex },
          { author: regex }
        ]
      };
    }
    
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const skip = (page - 1) * limit;

    let news = await News.find(query).skip(skip).limit(limit);

    let totalDocuments = await News.countDocuments(query);

    if (req.query.sort === "published") {
      news = news.sort((a, b) => new Date(b.published) - new Date(a.published)); // Сортировка по убыванию даты
    }
    res.json({ news, totalDocuments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postNews(req, res) {
  const data = new News({
    author: req.body.author,
    published: req.body.published,
    image: req.body.image,
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getNewsById(req, res) {
  try {
    const data = await News.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function patchNews(req, res) {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await News.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteNews(req, res) {
  try {
    const id = req.params.id;
    const data = await News.findByIdAndDelete(id);
    res.send(`Document with ${data.title} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  getNews,
  postNews,
  getNewsById,
  patchNews,
  deleteNews,
};
