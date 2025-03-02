import express from "express";

import { checkAuth, login, logout, register } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);
router.get("/check", checkAuth);

router.post("/logout", logout);

export default router;
