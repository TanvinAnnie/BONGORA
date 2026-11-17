
import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { registerSchema } from "../validations/auth.validation";
import { loginUser } from "../services/auth.service";
import { loginSchema } from "../validations/login.validation";
import { AuthRequest } from "../middlewares/auth.middleware";
import User from "../models/User";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await registerUser(validation.data);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";

    const statusCode =
      message === "Email or phone number already registered" ? 409 : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, password } = validation.data;

    const result = await loginUser(email, password);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("bongora_token", result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result.user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    const statusCode =
      message === "Account is inactive" ? 403 : 401;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Get Logged-in User
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

// Logout
export const logout = (
  _req: Request,
  res: Response
): void => {
  res.clearCookie("bongora_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};
