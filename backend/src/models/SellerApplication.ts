
import mongoose, { Document, Schema } from "mongoose";

export type SellerApplicationStatus =
  | "pending"
  | "approved"
  | "rejected";

export interface ISellerApplication extends Document {
  user: mongoose.Types.ObjectId;
  storeName: string;
  storeDescription: string;
  contactPhone: string;
  businessAddress: string;
  status: SellerApplicationStatus;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sellerApplicationSchema =
  new Schema<ISellerApplication>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      storeName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
      },

      storeDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      contactPhone: {
        type: String,
        required: true,
        trim: true,
        match: /^01[3-9]\d{8}$/,
      },

      businessAddress: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },

      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },

      reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },

      reviewedAt: {
        type: Date,
      },

      rejectionReason: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

// One user can have only one pending application.
sellerApplicationSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "pending",
    },
  }
);

// Admin application management.
sellerApplicationSchema.index({
  status: 1,
  createdAt: -1,
});

const SellerApplication =
  mongoose.model<ISellerApplication>(
    "SellerApplication",
    sellerApplicationSchema
  );

export default SellerApplication;
