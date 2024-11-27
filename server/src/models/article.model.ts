import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

interface IArticle extends Document {
  title: string;
  description: string;
  content: string;
  user: mongoose.Schema.Types.ObjectId;
  slug: string;
  views: number;
  comments: mongoose.Schema.Types.ObjectId[];
}

const articleSchema: Schema = new mongoose.Schema<IArticle>(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    // array of id's of all comments in article
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// slugify the title of article to use in article url
articleSchema.pre("validate", function (this: IArticle, next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

const Article = mongoose.model<IArticle>("Article", articleSchema);
export default Article;
