import { Request, Response } from "express";
import Chat from "../models/chatModel";
import { logger } from "../startup/logger";

export const createChat = async (req: Request, res: Response) => {
  try {
    const { members, type, course, program, department } = req.body;

    const chat = new Chat({
      members,
      type,
      course,
      program,
      department,
      messages: [],
    });

    await chat.save();
    res.status(201).json({ message: "Chat successfully created", chat });
  } catch (error) {
    logger.error((error as Error).message);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const chats = await Chat.find({ members: req.user?._id }).populate(
      "members"
    );

    res.status(200).json({ message: "Chats successfully fetched", chats });
  } catch (error) {
    logger.error((error as Error).message);
    res.status(500).json({ error: "Failed to get chats" });
  }
};
