import { Request, Response } from "express";
import { User, validateUser } from "../models/userModel";
import bcrypt from "bcrypt";
import { logger } from "../startup/logger";

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ indexNumber: req.body.indexNumber });
    if (!user) return res.status(400).send("Invalid index number or password");

    const validPassword = bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
      return res.status(400).send("Invalid index number or password");

    const token = user.generateAuthToken();
    res.cookie('token', token, {httpOnly: true, secure: true, sameSite: 'strict'})
    
    res.json({ message: "Login successful" });

  } catch (error) {
    logger.error(`Error in login: ${(error as Error).message}`)
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
