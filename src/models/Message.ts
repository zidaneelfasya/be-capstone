import mongoose, { Schema, Document } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    thought: { type: String, required: true },
    thread_id: { type: String, ref: "Thread", required: true }, 
  },
  { timestamps: true } 
);

export default mongoose.model("Message", MessageSchema);