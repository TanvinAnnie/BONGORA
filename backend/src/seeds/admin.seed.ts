
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

dotenv.config();

const seedAdmin = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const adminPhone = process.env.ADMIN_PHONE;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (
      !mongoURI ||
      !adminName ||
      !adminEmail ||
      !adminPhone ||
      !adminPassword
    ) {
      throw new Error("Required environment variables are missing");
    }

    if (adminPassword.length < 12) {
      throw new Error("Admin password must be at least 12 characters");
    }

    await mongoose.connect(mongoURI);

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      if (existingAdmin.role !== "admin") {
        throw new Error(
          "This email already belongs to a non-admin user"
        );
      }

      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await User.create({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Super Admin created successfully!");
    console.log(`Admin email: ${adminEmail}`);
  } catch (error) {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

seedAdmin();
