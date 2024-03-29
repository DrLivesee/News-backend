import { model, Document, Schema } from "mongoose";

export interface INews extends Document {
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

// newsSchema.pre<INews>('save', function(next) {
//     const requiredFields: Array<keyof INews> = ['author', 'published', 'image', 'title', 'description', 'content'];
//     for (const field of requiredFields) {
//         if (!this[field]) {
//             return next(new Error(`${field} is required`));
//         }
//     }
//     next();
// });

export default model<INews>('News', newsSchema);
