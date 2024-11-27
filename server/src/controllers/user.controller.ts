import { Request, Response } from "express";
import fs from "fs";
import User from "../models/user.model";
import Article from "../models/article.model";
import Comment from "../models/comment.model";

export const profile = async (req: Request, res: Response) => {
  try {
    let user = await User.findById(req.params.id)
      .select("-password") // exclude password from user
      .lean()
      .exec();

    if (!user) {
      return res.status(400).json({ message: "User doesn't exists" }) as any;
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error in fetching profile", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const userArticles = async (req: Request, res: Response) => {
  try {
    // let articles = await Article.find({ user: req.user?.userId });
    let articles = await Article.find({ user: req.params.id });

    return res.status(200).json({ articles }) as any;
  } catch (err) {
    console.error("Error in fetching user articles", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { username, name } = req.body;

    let user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(400).json({ message: "User doesn't exists" }) as any;
    }

    // update user info
    user.username = username;
    user.name = name;

    // if user uploads a new avatar
    if (req.file) {
      // remove previous avatar if it exists
      if (user.profileImg) {
        const oldAvatarPath = user.profileImg;

        // check if the file exists before trying to delete it
        fs.stat(oldAvatarPath, (err) => {
          if (err) {
            throw new Error("Error in deleting previous avatar");
          }

          fs.unlink(oldAvatarPath, (err) => {
            if (err) {
              throw new Error("Error in deleting previous avatar");
            }
          });
        });
      }

      // update user profile pic
      user.profileImg = req.file.path;
    }

    await user.save();

    // destructure all user info and password separately
    const { password, ...userInfo } = user._doc;

    return res
      .status(200)
      .json({ message: "User updated successfully", user: userInfo }) as any;
  } catch (err) {
    console.error("Error in updating user", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    // delete user
    await User.findByIdAndDelete(req.user?.userId);
    // delete all articles of that user
    await Article.deleteMany({ user: req.user?.userId });
    // delete all comments of that user
    await Comment.deleteMany({ user: req.user?.userId });

    return res.status(200).json({ message: "User deleted" }) as any;
  } catch (err) {
    console.error("Error in deleting user", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};
