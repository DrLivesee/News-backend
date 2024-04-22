import { model, Document, Schema } from "mongoose";

export interface INews extends Document {
  id: string;
  author: string;
  published: Date;
  image: string;
  title: string;
  description: string;
  content: string;
}

export interface INewsGetResponse {
  news: INews[],
  totalDocuments: number
}

const newsSchema = new Schema<INews>({
  author: {
    required: true,
    type: String,
  },
  published: {
    required: true,
    type: Date,
    default: Date.now()
  },
  image: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
});
export default model<INews>('News', newsSchema);
