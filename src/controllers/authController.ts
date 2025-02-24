import { compare, hashSync } from "bcrypt-ts";

import { SignJWT } from "jose";
import { serialize } from "cookie";
import { connectToDatabase } from "../lib/mongodb";
import User from "../models/User";


const secretKey = new TextEncoder().encode(
  process.env.JWT_SECRET || "!@#$%^&*()"
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

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    const id = serialize("idUser", existingUser._id.toString(), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });
    res.setHeader("Set-Cookie", [cookie, id]);
    res.status(200).json({
      message: "Login successful",

      data: {
        id: existingUser._id,
        username,
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
    // Cek apakah user sudah terdaftar
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
    
    const cookie = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      expires: new Date(0),
    });

    res.setHeader("Set-Cookie", cookie);
    res.status(200).json({ message: "Logout successful" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
