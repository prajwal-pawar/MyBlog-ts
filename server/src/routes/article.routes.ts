import express from "express";
import {
  createArticle,
  deleteArticle,
  fetchAllArticles,
  getArticleById,
  getArticleBySlug,
  updateArticle,
} from "../controllers/article.controller";
import authenticateToken from "../middlewares/auth";

const router = express.Router();

router.post("/create", authenticateToken, createArticle);
router.get("/fetch-all", authenticateToken, fetchAllArticles);
router.get("/id/:id", authenticateToken, getArticleById);
router.get("/:slug", authenticateToken, getArticleBySlug);
router.put("/update/:id", authenticateToken, updateArticle);
router.delete("/delete/:id", authenticateToken, deleteArticle);

export default router;
