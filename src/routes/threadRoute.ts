import express from "express";
import { createThread, getThreads, getThreadsUser } from "../controllers/threadController";

const router = express.Router();

router.post("/add", createThread);

// router.get("/", getThreads)
router.get("/", getThreadsUser)


export default router;
