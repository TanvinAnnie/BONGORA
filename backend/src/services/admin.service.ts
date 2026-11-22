
import mongoose from "mongoose";
import SellerApplication from "../models/SellerApplication";
import Store from "../models/Store";
import User from "../models/User";

// Generate a unique store slug
const generateStoreSlug = (storeName: string, applicationId: string) => {
  const baseSlug = storeName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `${baseSlug}-${applicationId.slice(-8)}`;
};

// Approve Seller Application
export const approveSellerApplication = async (
  applicationId: string,
  adminId: string
) => {
  if (
    !mongoose.Types.ObjectId.isValid(applicationId) ||
    !mongoose.Types.ObjectId.isValid(adminId)
  ) {
    throw new Error("Invalid application or admin ID");
  }

  const session = await mongoose.startSession();

  try {
    let result: {
      application: unknown;
      store: unknown;
    } | null = null;

    await session.withTransaction(async () => {
      const application = await SellerApplication.findOne({
        _id: applicationId,
        status: "pending",
      }).session(session);

      if (!application) {
        throw new Error("Pending seller application not found");
      }

      const user = await User.findById(application.user).session(session);

      if (!user) {
        throw new Error("Applicant user not found");
      }

      if (!user.isActive || user.role !== "customer") {
        throw new Error("Applicant account is not eligible for approval");
      }

      const existingStore = await Store.findOne({
        owner: user._id,
      }).session(session);

      if (existingStore) {
        throw new Error("Applicant already has a store");
      }

      const slug = generateStoreSlug(
        application.storeName,
        application._id.toString()
      );

      const [store] = await Store.create(
        [
          {
            owner: user._id,
            application: application._id,
            storeName: application.storeName,
            slug,
            description: application.storeDescription,
            contactPhone: application.contactPhone,
            businessAddress: application.businessAddress,
            status: "active",
          },
        ],
        { session }
      );

      user.role = "seller";
      user.isActive = true;
      await user.save({ session });

      application.status = "approved";
      application.reviewedBy = new mongoose.Types.ObjectId(adminId);
      application.reviewedAt = new Date();
      application.rejectionReason = undefined;

      await application.save({ session });

      result = {
        application: {
          id: application._id,
          status: application.status,
          reviewedBy: application.reviewedBy,
          reviewedAt: application.reviewedAt,
        },
        store: {
          id: store._id,
          storeName: store.storeName,
          slug: store.slug,
          status: store.status,
        },
      };
    });

    if (!result) {
      throw new Error("Seller approval failed");
    }

    return result;
  } finally {
    await session.endSession();
  }
};
