
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

dotenv.config();

const resetAdminPassword = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!mongoURI || !adminEmail || !adminPassword) {
      throw new Error("Required environment variables are missing");
    }

    if (adminPassword.length < 12) {
      throw new Error("Admin password must be at least 12 characters");
    }

    await mongoose.connect(mongoURI);
    console.log(`Reset Database: ${mongoose.connection.name}`);

    const admin = await User.findOne({
      email: adminEmail,
      role: "admin",
    });
    console.log("Admin found:", Boolean(admin));
console.log("Admin active:", admin?.isActive);
console.log("Admin email:", admin?.email);

    if (!admin) {
      throw new Error("Admin account not found");
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    admin.password = hashedPassword;
    await admin.save();
    const savedAdmin = await User.findOne({
  email: adminEmail,
}).select("+password");

const passwordMatches = await bcrypt.compare(
  adminPassword,
  savedAdmin!.password
);

console.log("Password verification:", passwordMatches);

    console.log("Admin password reset successfully!");
    console.log(`Admin email: ${adminEmail}`);
  } catch (error) {
    console.error("Admin password reset failed:", error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

resetAdminPassword();
