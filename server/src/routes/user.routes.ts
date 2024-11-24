import express from "express";
import {
  deleteUser,
  profile,
  updateUser,
  userArticles,
} from "../controllers/user.controller";
import authenticateToken from "../middlewares/auth";
import upload from "../configs/multer";

const router = express.Router();

router.get("/profile/:id", authenticateToken, profile);
router.get("/articles/:id", authenticateToken, userArticles);
router.put("/update", authenticateToken, upload.single("avatar"), updateUser);
router.delete("/delete", authenticateToken, deleteUser);

export default router;
