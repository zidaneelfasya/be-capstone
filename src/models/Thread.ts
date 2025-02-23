import mongoose from "mongoose";


const ThreadSchema = new mongoose.Schema(
  {
    id_thread: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    user_id: { type: String, ref: "User", required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("Thread", ThreadSchema);
