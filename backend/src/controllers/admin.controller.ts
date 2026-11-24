
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  approveSellerApplication,
  getSellerApplications,
  rejectSellerApplication,
  suspendStore,
  reactivateStore,
} from "../services/admin.service";
import { SellerApplicationStatus } from "../models/SellerApplication";
import { getAllStores } from "../services/admin.service";
import { StoreStatus } from "../models/Store";


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

// Get Seller Applications
export const getSellerApplicationsList = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const allowedStatuses: SellerApplicationStatus[] = [
      "pending",
      "approved",
      "rejected",
    ];

    if (
      status !== undefined &&
      (typeof status !== "string" ||
        !allowedStatuses.includes(status as SellerApplicationStatus))
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
      return;
    }

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination values",
      });
      return;
    }

    const result = await getSellerApplications(
      status as SellerApplicationStatus | undefined,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      message: "Seller applications fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller applications",
    });
  }
};


 // Reject Seller Application
export const rejectSeller = async (
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

    const { rejectionReason } = req.body;

    if (
      typeof rejectionReason !== "string" ||
      rejectionReason.trim().length < 5 ||
      rejectionReason.trim().length > 500
    ) {
      res.status(400).json({
        success: false,
        message: "Rejection reason must be between 5 and 500 characters",
      });
      return;
    }

    const result = await rejectSellerApplication(
      applicationId,
      req.user!.id,
      rejectionReason
    );

    res.status(200).json({
      success: true,
      message: "Seller application rejected successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to reject seller application";
const statusCode =
  message === "Pending seller application not found"
    ? 404
    : message === "Invalid application or admin ID" ||
      message === "Rejection reason is required"
    ? 400
    : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};


// Get All Stores for Admin
export const getAllStoresList = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const status = req.query.status;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const allowedStatuses: StoreStatus[] = [
      "active",
      "suspended",
    ];

    if (
      status !== undefined &&
      (typeof status !== "string" ||
        !allowedStatuses.includes(status as StoreStatus))
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid store status",
      });
      return;
    }

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination values",
      });
      return;
    }

    const result = await getAllStores(
      status as StoreStatus | undefined,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      message: "Stores fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch stores",
    });
  }
};


 // Suspend Store
export const suspendStoreController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const storeId = req.params.storeId;

    if (typeof storeId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
      return;
    }

    const result = await suspendStore(storeId);

    res.status(200).json({
      success: true,
      message: "Store suspended successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to suspend store";

    const statusCode =
      message === "Invalid store ID"
        ? 400
        : message === "Store not found"
        ? 404
        : message === "Store is already suspended"
        ? 409
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Reactivate Store
export const reactivateStoreController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const storeId = req.params.storeId;

    if (typeof storeId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
      return;
    }

    const result = await reactivateStore(storeId);

    res.status(200).json({
      success: true,
      message: "Store reactivated successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reactivate store";

    const statusCode =
      message === "Invalid store ID"
        ? 400
        : message === "Store not found"
        ? 404
        : message === "Store is already active"
        ? 409
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

