import express from "express";
import authRoutes from "./auth.routes";
import articleRoutes from "./article.routes";
import userRoutes from "./user.routes";
import commentRoutes from "./comment.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/article", articleRoutes);
router.use("/user", userRoutes);
router.use("/comment", commentRoutes);

export default router;
