import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/comment.model";
import Article from "../models/article.model";

export const createComment = async (req: Request, res: Response) => {
  try {
    // destructure article as articleId
    const { content, article: articleId } = req.body;

    let article = await Article.findById(articleId);

    if (!article) {
      return res.status(404).json({ message: "Article not found" }) as any;
    }

    let comment = await Comment.create({
      content,
      user: req.user?.userId,
      article: articleId,
    });

    // add comment to article and update article in db
    article.comments.push(comment._id as mongoose.Schema.Types.ObjectId);
    await article.save();

    let populatedComment = await Comment.findById(comment._id)
      .populate("user", "name profileImg createdAt")
      .exec();

    return res
      .status(200)
      .json({ message: "Comment posted", comment: populatedComment }) as any;
  } catch (err) {
    console.error("Error creating a comment", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    let comment = await Comment.findById(req.params.id);

    // check if user is authorized to delete the comment
    if (comment?.user.toString() !== req.user?.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      }) as any;
    }

    let articleId = comment?.article;

    // delete comment from db
    await comment?.deleteOne();
    // delete comment from article schema
    await Article.findByIdAndUpdate(articleId, {
      // delete comment id from article comment array
      $pull: {
        comments: req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Comment deleted successfully" }) as any;
  } catch (err) {
    console.error("Error deleting a comment", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};
