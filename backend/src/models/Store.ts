
import mongoose, { Document, Schema } from "mongoose";

export type StoreStatus = "active" | "suspended";

export interface IStore extends Document {
  owner: mongoose.Types.ObjectId;
  application: mongoose.Types.ObjectId;
  storeName: string;
  slug: string;
  description: string;
  logo?: string;
  banner?: string;
  contactPhone: string;
  businessAddress: string;
  status: StoreStatus;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStore>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    application: {
      type: Schema.Types.ObjectId,
      ref: "SellerApplication",
      required: true,
      unique: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    logo: {
      type: String,
      trim: true,
    },

    banner: {
      type: String,
      trim: true,
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
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Store = mongoose.model<IStore>("Store", storeSchema);

export default Store;
