
import mongoose, { Document, Schema } from "mongoose";

export interface IProductVariant extends Document {
  product: mongoose.Types.ObjectId;
  size: string;
  color: string;
  sku: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productVariantSchema = new Schema<IProductVariant>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },

    color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productVariantSchema.index(
  { product: 1, size: 1, color: 1 },
  { unique: true }
);

const ProductVariant = mongoose.model<IProductVariant>(
  "ProductVariant",
  productVariantSchema
);

export default ProductVariant;
