import { parse } from "cookie";
import { jwtVerify } from "jose";
// import { NextApiRequest, NextApiResponse } from "next";
import dotenv from "dotenv";


dotenv.config();
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "!@#$%^&*()");

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error("Invalid token:", error);
    throw new Error("Invalid or expired token")
  }
}
export async function verifyAPI(req: any, res: any) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode = await jwtVerify(token, secretKey);
    req.user = decode.payload; 
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
}
