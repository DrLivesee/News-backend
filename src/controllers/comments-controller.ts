import { Request, Response } from "express";

import Comment, {
  IComment,
  ICommentGetResponse,
} from "@src/models/commentModel";

async function getComments(req: Request, res: Response): Promise<void> {
  try {
    let comments: IComment[] = await Comment.find();

    let totalDocuments: number = await Comment.countDocuments();

    res.json({ comments, totalDocuments } as ICommentGetResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCommentsForNews(req: Request, res: Response): Promise<void> {
  const newsId: string = req.params.newsId as string;

  try {
    let comments: IComment[] = await Comment.find({ newsId });
    const totalDocuments: number = comments.length;

    if (req.query.sort === "createdAt") {
      comments = comments.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    res.json({ comments, totalDocuments } as ICommentGetResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function postComment(req: Request, res: Response): Promise<void> {
  const comment: IComment = req.body;
  const data: IComment = new Comment({
    ...comment,
  });

  try {
    const dataToSave: IComment = await data.save();
    res.status(200).json(dataToSave as IComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getCommentById(req: Request, res: Response): Promise<void> {
  try {
    const data: IComment | null = await Comment.findById(req.params.id);
    res.json(data as IComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function patchComment(req: Request, res: Response): Promise<void> {
  try {
    const id: string = req.params.id;
    const updatedData: Partial<IComment> = req.body;
    const options: { new: boolean } = { new: true };

    const result: IComment | null = await Comment.findByIdAndUpdate(
      id,
      updatedData,
      options
    );

    res.send(result as IComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteComment(req: Request, res: Response): Promise<void> {
  try {
    const id: string = req.params.id;
    await Comment.findByIdAndDelete(id);
    res.send(`Comment with ID ${id} has been deleted.` as string);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export {
  getComments,
  postComment,
  getCommentById,
  patchComment,
  deleteComment,
  getCommentsForNews,
};
