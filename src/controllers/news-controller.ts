import { Request, Response } from "express";

import News, { INews, INewsGetResponse } from "@src/models/newsModel";

async function getNews(req: Request, res: Response): Promise<void> {
  try {
    let query: any = {};

    if (req.query.searchQuery) {
      const searchQuery: string = req.query.searchQuery as string;

      const regex = new RegExp(searchQuery, "i");

      query = {
        $or: [{ title: regex }, { description: regex }, { author: regex }],
      };
    }

    const page: number = parseInt(req.query.page as string);
    const limit: number = parseInt(req.query.limit as string);
    const skip: number = (page - 1) * limit;

    let news: INews[] = await News.find(query).skip(skip).limit(limit);

    let totalDocuments: number = await News.countDocuments(query);

    if (req.query.sort === "published") {
      news = news.sort(
        (a, b) =>
          new Date(b.published).getTime() - new Date(a.published).getTime()
      ); 
    }
    res.json({ news, totalDocuments } as INewsGetResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postNews(req: Request, res: Response): Promise<void> {
  const news : INews = req.body;

  const data: INews = new News({
    ...news
  });

  try {
    const dataToSave: INews = await data.save();
    res.status(200).json(dataToSave as INews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getNewsById(req: Request, res: Response): Promise<void> {
  try {
    const data: INews | null = await News.findById(req.params.id);
    res.json(data as INews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function patchNews(req: Request, res: Response): Promise<void> {
  try {
    const id: string = req.params.id;
    const updatedData: Partial<INews> = req.body;
    const options = { new: true };

    const result: INews = await News.findByIdAndUpdate(
      id,
      updatedData,
      options
    );

    res.send(result as INews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteNews(req: Request, res: Response): Promise<void> {
  try {
    const id: string = req.params.id;
    const data: INews = await News.findByIdAndDelete(id);
    res.send(`Document with ${data?.title} has been deleted..` as string);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export { getNews, postNews, getNewsById, patchNews, deleteNews };
