import express from "express";
import { createMessage, getMessages } from "../controllers/messageController";

const router = express.Router();

router.get("/", getMessages);
router.post("/add", createMessage);

export default router;
