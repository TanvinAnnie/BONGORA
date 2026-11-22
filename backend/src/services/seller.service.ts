
import mongoose from "mongoose";
import SellerApplication from "../models/SellerApplication";
import User from "../models/User";
import { SellerApplicationInput } from "../validations/seller.validation";

// Submit Seller Application
export const submitSellerApplication = async (
  userId: string,
  data: SellerApplicationInput
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isActive) {
    throw new Error("Your account is inactive");
  }

  if (user.role !== "customer") {
    throw new Error("Only customers can apply to become sellers");
  }

  const existingApplication = await SellerApplication.findOne({
    user: userId,
    status: "pending",
  });

  if (existingApplication) {
    throw new Error("You already have a pending seller application");
  }

  const application = await SellerApplication.create({
    user: userId,
    storeName: data.storeName,
    storeDescription: data.storeDescription,
    contactPhone: data.contactPhone,
    businessAddress: data.businessAddress,
    status: "pending",
  });

  return application;
};

// Get Current User's Seller Applications
export const getMySellerApplications = async (
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const applications = await SellerApplication.find({
    user: userId,
  }).sort({ createdAt: -1 });

  return applications;
};
