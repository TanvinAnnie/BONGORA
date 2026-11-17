
import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: "customer" | "seller" | "admin";
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.bongora_token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const decoded = verifyToken(token);

    if (
      typeof decoded === "string" ||
      typeof decoded !== "object" ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
      return;
    }

    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
      return;
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
