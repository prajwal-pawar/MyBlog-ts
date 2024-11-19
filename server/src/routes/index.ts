import express from "express";
import authRoutes from "./auth.routes";
import articleRoutes from "./article.routes";
import userRoutes from "./user.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/article", articleRoutes);
router.use("/user", userRoutes);

export default router;
