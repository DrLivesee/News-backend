import { model, Document, Schema } from "mongoose";

export interface IComment extends Document {
  _id: string;
  createdAt?: Date;
  name: string;
  avatar: string;
  text: string;
  userId: Schema.Types.ObjectId | string;
  newsId: Schema.Types.ObjectId | string;
}

export interface ICommentGetResponse  {
  comments: IComment[],
  totalDocuments: number
}

export interface ICommentsForUserGetResponse  {
  ids: string[],
  totalDocuments: number
}

function isValidUserId(value: any): boolean {
  return typeof value === 'string' || value instanceof Schema.Types.ObjectId;
}

const commentSchema = new Schema<IComment>({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.Mixed,
    required: function(this: any): boolean {
      return isValidUserId(this.userId);
    },
    ref: "User",
  },
  newsId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "News",
  },
});

export default model<IComment>("Comment", commentSchema);
