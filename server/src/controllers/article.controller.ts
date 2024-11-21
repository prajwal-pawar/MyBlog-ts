import { Request, Response } from "express";
import Article from "../models/article.model";

export const createArticle = async (req: Request, res: Response) => {
  try {
    const { title, description, content } = req.body;

    let article = new Article({
      title,
      description,
      content,
      user: req.user?.userId,
    });

    await article.save();

    return res.status(200).json({ message: "Article published" }) as any;
  } catch (err) {
    console.error("Error creating article", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const fetchAllArticles = async (req: Request, res: Response) => {
  try {
    // page and limit have default values
    const { searchQuery, page = "1", limit = "10" } = req.query;

    // parse page and limit as integers
    let pageNumber = parseInt(page as string);
    let limitNumber = parseInt(limit as string);

    let query = {};

    if (searchQuery) {
      // find articles based on title or user
      query = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { "user.username": { $regex: searchQuery, $options: "i" } },
        ],
      };
    }

    // get total articles based on query
    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / limitNumber);

    const articles = await Article.find(query)
      .sort({ createdAt: "desc" })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      // .populate("user", "username");
      .populate("user", "name");

    return res.status(200).json({ articles, totalPages, totalArticles }) as any;
  } catch (err) {
    console.error("Error in fetching all articles");
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const getArticleById = async (req: Request, res: Response) => {
  try {
    let article = await Article.findById(req.params.id)
      .populate("user", "username") // populate only username, not all user info
      .exec();

    if (!article) {
      return res.status(404).json({ message: "Article not found" }) as any;
    }

    return res.status(200).json({ article }) as any;
  } catch (err) {
    console.error("Error in fetching article", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const getArticleBySlug = async (req: Request, res: Response) => {
  try {
    let article = await Article.findOne({ slug: req.params.slug })
      // .populate("user", "username")
      .populate("user", "name")
      .exec();

    if (!article) {
      return res.status(404).json({ message: "Article not found" }) as any;
    }

    // increase view count whenever user clicks on article
    article.views++;
    await article.save();

    return res.status(200).json({ article }) as any;
  } catch (err) {
    console.error("Error in fetching article", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const { title, description, content } = req.body;

    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" }) as any;
    }

    // check if user is authorized to update the article
    if (article.user.toString() !== req.user?.userId) {
      return res.status(403).json({
        message: "You are not authorized to update this article",
      }) as any;
    }

    // update article
    article.title = title;
    article.description = description;
    article.content = content;

    await article.save();

    return res
      .status(200)
      .json({ message: "Article updated successfully" }) as any;
  } catch (err) {
    console.error("Error in updating article", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" }) as any;
    }

    // check if user is authorized to delete the article
    if (article.user.toString() !== req.user?.userId) {
      return res.status(403).json({
        message: "You are not authorized to delete this article",
      }) as any;
    }

    await article.deleteOne();

    return res
      .status(200)
      .json({ message: "Article deleted successfully" }) as any;
  } catch (err) {
    console.error("Error in deleting article", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};
