
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
  console.log("LOGIN FUNCTION CALLED");
  console.log("LOGIN EMAIL:", email.toLowerCase());

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  console.log("USER FOUND:", Boolean(user));
  console.log("USER ROLE:", user?.role);
  console.log("USER ACTIVE:", user?.isActive);

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

  console.log("PASSWORD MATCH:", isPasswordValid);
  console.log("========== END LOGIN DEBUG ==========");

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
