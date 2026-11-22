
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getMyStore,
  updateMyStore,
} from "../services/seller.service";
import { updateStoreSchema } from "../validations/store.validation";

// Get My Store
export const getStoreProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const store = await getMyStore(req.user!.id);

    res.status(200).json({
      success: true,
      message: "Store profile fetched successfully",
      data: store,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch store";

    const statusCode =
      message === "Invalid user ID" ? 400 :
      message === "Store not found" ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Update My Store
export const updateStoreProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const validation = updateStoreSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const store = await updateMyStore(
      req.user!.id,
      validation.data
    );

    res.status(200).json({
      success: true,
      message: "Store profile updated successfully",
      data: store,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update store";

    const statusCode =
      message === "Invalid user ID" ? 400 :
      message === "Store not found" ? 404 :
      message === "Your store is suspended" ? 403 : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
