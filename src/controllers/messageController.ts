import { verifyAPI } from "../lib/auth";
import { connectToDatabase } from "../lib/mongodb";
import Message from "../models/Message";
import Thread from "../models/Thread";

export const createMessage = async (req: any, res: any) => {
  try {
    await verifyAPI(req, res);
    await connectToDatabase();
    const { content, thread_id } = req.body;
    if (!thread_id) {
      return res.status(400).json({ message: "Thread ID is required" });
    }
    const thread = await Thread.findOne({
      $and: [{ _id: thread_id }, { user_id: req.user.id }],
    })
      .populate("user_id", "username _id")
      .lean();
    const newMessage = new Message({
      role: "user",
      content: content,
      thought: "",
      thread_id: thread_id,
    });
    await newMessage.save();
    return res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getMessages = async (req: any, res: any) => {
  try {
    await connectToDatabase();
    const { thread_id } = req.body; 
    console.log("thread_Id", thread_id);
    if (!thread_id) {
      return res.status(400).json({ message: "Thread ID is required" });
    }

    const messages = await Message.find({ thread_id: thread_id })
      .sort({ createdAt: 1 }) 
      .populate("thread_id", "id_thread title");

    return res.status(200).json({ messages });
  } catch (error: any) {
    console.error("Error fetching messages:", error.message);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
