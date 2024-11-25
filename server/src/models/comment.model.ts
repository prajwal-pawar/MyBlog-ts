import mongoose, { Document, Schema } from "mongoose";

interface IComment extends Document {
  content: string;
  user: mongoose.Schema.Types.ObjectId;
  article: mongoose.Schema.Types.ObjectId;
}

const commentSchema: Schema = new mongoose.Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<IComment>("Comment", commentSchema);
export default Comment;
