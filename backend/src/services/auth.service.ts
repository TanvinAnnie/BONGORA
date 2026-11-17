
import bcrypt from "bcryptjs";
import User from "../models/User";
import { RegisterInput } from "../validations/auth.validation";
import { generateToken } from "../utils/jwt";

// Customer Registration
export const registerUser = async (data: RegisterInput) => {
  const existingUser = await User.findOne({
    $or: [
      { email: data.email },
      { phone: data.phone },
    ],
  });

  if (existingUser) {
    throw new Error("Email or phone number already registered");
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: hashedPassword,
    role: "customer",
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  };
};

// User Login
export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Account is inactive");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id.toString());

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  };
};
