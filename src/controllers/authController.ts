import { compare, hashSync } from "bcrypt-ts";
import { SignJWT, jwtVerify } from "jose";
import { connectToDatabase } from "../lib/mongodb";
import User from "../models/User";

const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "mysecretkey"
);

export const login = async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  await connectToDatabase();

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await compare(password, existingUser.password);
    if (!existingUser || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = await new SignJWT({
      id: existingUser._id,
      username: existingUser.username,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secretKey);

    return res.status(200).json({
      message: "Login successful",
      data: {
        id: existingUser._id,
        username,
        token, // Kirim token ke klien
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

export const register = async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  await connectToDatabase();

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = hashSync(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error });
  }
};

export const logout = async (req: any, res: any) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const checkAuth = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ isAuthenticated: false });
    }

    const token = authHeader.split(" ")[1]; // Ambil token dari header
    const decoded = await jwtVerify(token, secretKey);

    res.status(200).json({ isAuthenticated: true, user: decoded.payload });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
};
