
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { approveSellerApplication } from "../services/admin.service";

// Approve Seller Application
export const approveSeller = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const applicationId = req.params.applicationId;

if (typeof applicationId !== "string") {
  res.status(400).json({
    success: false,
    message: "Invalid application ID",
  });
  return;
}

    const result = await approveSellerApplication(
      applicationId,
      req.user!.id
    );

    res.status(200).json({
      success: true,
      message: "Seller application approved successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to approve seller application";

    const statusCode =
      message === "Pending seller application not found"
        ? 404
        : message === "Invalid application or admin ID" ||
          message === "Applicant account is not eligible for approval" ||
          message === "Applicant already has a store"
        ? 409
        : message === "Applicant user not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
