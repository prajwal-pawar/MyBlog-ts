import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../configs/environment";

const JWT_SECRET_KEY = String(env.jwtSecretKey);

interface UserPayload {
  userId: string;
}

// Extend the Express Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.token || null;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Authentication token is required" }) as any;
    }

    const decodedToken = jwt.verify(token, JWT_SECRET_KEY) as UserPayload;

    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" }) as any;
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    console.error("Error authenticating jwt token", err);
    return res.status(500).json({ message: "Internal server error" }) as any;
  }
};

export default authenticateToken;
