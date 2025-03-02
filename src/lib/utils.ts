import jwt from "jsonwebtoken"

export const generateToken = (userId: any, res: any) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: "24h"

  })
  res.cookie("jwt")
}