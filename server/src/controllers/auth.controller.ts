import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import env from "../configs/environment";

const JWT_SECRET_KEY = String(env.jwtSecretKey);

export const register = async (req: Request, res: Response) => {
  try {
    const { username, name, password } = req.body;

    if (!username || !name || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required" }) as any;
    }

    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "User already exists" }) as any;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      name,
      password: hashedPassword,
      profileImg: "",
    });

    await user.save();

    return res
      .status(201)
      .json({ message: "User registered successfully" }) as any;
  } catch (err) {
    console.error("Error in registering user", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required" }) as any;
    }

    let user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "User doesn't exists" }) as any;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" }) as any;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    // destructure all user info and password separately
    const { password: userPassword, ...userInfo } = user._doc;

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Login successful", userInfo }) as any;
  } catch (err) {
    console.error("Error logging in user", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // clear cookie
    return res
      .clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error logging out user", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};
