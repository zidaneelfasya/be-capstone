import { verifyAPI } from "../lib/auth";
import { connectToDatabase } from "../lib/mongodb";
import Thread from "../models/Thread";

export const createThread = async (req: any, res: any) => {
  try {
    await verifyAPI(req, res);
    await connectToDatabase();
    const me = req.user.id;

    const { title } = req.body;
    const newId = crypto.randomUUID();
    const newThread = new Thread({ _id: newId, title, user_id: me });
    console.log(newId);
    const savedThread = await newThread.save();

    return res
      .status(201)
      .json({
        message: "User registered successfully",
        thread: savedThread,
        user: me,
      });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getAllThreads = async (req: any, res: any) => {
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
  try {
    await verifyAPI(req, res);
    await connectToDatabase();

    const me = req.user.id; 

    const threads = await Thread.find({ user_id: me })
      .populate("user_id", "username _id")
      .sort({ updatedAt: -1 });

    return res.status(200).json({ message: "Success", data: threads });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
