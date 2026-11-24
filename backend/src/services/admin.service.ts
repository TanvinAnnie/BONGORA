
import mongoose from "mongoose";
import SellerApplication from "../models/SellerApplication";
import Store from "../models/Store";
import User from "../models/User";
import { SellerApplicationStatus } from "../models/SellerApplication";
import { StoreStatus } from "../models/Store";

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

// Get Seller Applications for Admin
export const getSellerApplications = async (
  status?: SellerApplicationStatus,
  page: number = 1,
  limit: number = 10
) => {
  const filter: {
    status?: SellerApplicationStatus;
  } = {};

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [applications, total] = await Promise.all([
    SellerApplication.find(filter)
      .populate("user", "name email phone")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    SellerApplication.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


// Reject Seller Application
export const rejectSellerApplication = async (
  applicationId: string,
  adminId: string,
  rejectionReason: string
) => {
  if (
    !mongoose.Types.ObjectId.isValid(applicationId) ||
    !mongoose.Types.ObjectId.isValid(adminId)
  ) {
    throw new Error("Invalid application or admin ID");
  }

  const reason = rejectionReason.trim();

  if (!reason) {
    throw new Error("Rejection reason is required");
  }

  const application = await SellerApplication.findOne({
    _id: applicationId,
    status: "pending",
  });

  if (!application) {
    throw new Error("Pending seller application not found");
  }

  application.status = "rejected";
  application.reviewedBy = new mongoose.Types.ObjectId(adminId);
  application.reviewedAt = new Date();
  application.rejectionReason = reason;

  await application.save();

  return {
    id: application._id,
    status: application.status,
    rejectionReason: application.rejectionReason,
    reviewedBy: application.reviewedBy,
    reviewedAt: application.reviewedAt,
  };
};



// Get All Stores for Admin
export const getAllStores = async (
  status?: StoreStatus,
  page: number = 1,
  limit: number = 10
) => {
  const filter: {
    status?: StoreStatus;
  } = {};

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [stores, total] = await Promise.all([
    Store.find(filter)
      .populate("owner", "name email phone role isActive")
      .populate("application", "storeName status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Store.countDocuments(filter),
  ]);

  return {
    stores,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};


 // Suspend Store
export const suspendStore = async (storeId: string) => {
  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    throw new Error("Invalid store ID");
  }

  const store = await Store.findById(storeId);

  if (!store) {
    throw new Error("Store not found");
  }

  if (store.status === "suspended") {
    throw new Error("Store is already suspended");
  }

  store.status = "suspended";
  await store.save();

  return {
    id: store._id,
    storeName: store.storeName,
    slug: store.slug,
    status: store.status,
  };
};

// Reactivate Store
export const reactivateStore = async (storeId: string) => {
  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    throw new Error("Invalid store ID");
  }

  const store = await Store.findById(storeId);

  if (!store) {
    throw new Error("Store not found");
  }

  if (store.status === "active") {
    throw new Error("Store is already active");
  }

  store.status = "active";
  await store.save();

  return {
    id: store._id,
    storeName: store.storeName,
    slug: store.slug,
    status: store.status,
  };
};
