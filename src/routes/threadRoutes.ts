import express from "express";
import { createThread, getThreads } from "../controllers/threadController";

const router = express.Router();

router.post("/add", createThread);

router.get("/", getThreads)

export default router;
