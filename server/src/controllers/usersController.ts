import { Request, Response } from "express";
import User from "../models/userModel";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?._id;
    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("id firstName lastName indexNumber")
      .exec();
    res.status(200).json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving users." });
  }
};
