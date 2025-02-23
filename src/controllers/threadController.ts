import { verifyAPI } from "../lib/auth";
import { connectToDatabase } from "../lib/mongodb";
import Thread from "../models/Thread";

export const createThread = async (req: any, res: any) => {
  try {
    await verifyAPI(req, res);
    await connectToDatabase();
    const me = req.user.payload.id;

    const { title } = req.body;
    const newId = crypto.randomUUID();
    const newThread = new Thread({ id_thread: newId, title, user_id: me });
    const savedThread = await newThread.save();

    return res
      .status(201)
      .json({ message: "User registered successfully", thread: savedThread });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getThreadsAll = async (req: any, res: any) => {
  try {
    const threads = await Thread.find().sort({ updatedAt: -1 });
    return res.status(200).json({
      message: "Success",
      data: threads,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getThreads = async (req: any, res: any) => {
  await verifyAPI(req, res);
  await connectToDatabase();
  const me = req.user.payload.id;
  try {
    
    
    const threads = await Thread.find({
      user_id: me,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Success",
      data: threads,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
