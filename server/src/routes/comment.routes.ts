import express from "express";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controller";
import authenticateToken from "../middlewares/auth";

const router = express.Router();

router.post("/create", authenticateToken, createComment);
router.delete("/delete/:id", authenticateToken, deleteComment);

export default router;
