
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  submitSellerApplication,
  getMySellerApplications,
} from "../services/seller.service";
import { sellerApplicationSchema } from "../validations/seller.validation";

// Submit Seller Application
export const applyAsSeller = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const validation = sellerApplicationSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const application = await submitSellerApplication(
      req.user!.id,
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Seller application submitted successfully",
      data: application,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to submit seller application";

    const statusCode =
      message === "You already have a pending seller application"
        ? 409
        : message === "User not found"
        ? 404
        : message === "Invalid user ID" ||
          message === "Your account is inactive" ||
          message === "Only customers can apply to become sellers"
        ? 403
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Get My Seller Applications
export const getMyApplications = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const applications = await getMySellerApplications(req.user!.id);

    res.status(200).json({
      success: true,
      message: "Seller applications fetched successfully",
      data: applications,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch seller applications";

    res.status(500).json({
      success: false,
      message,
    });
  }
};
