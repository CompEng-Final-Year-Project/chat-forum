import { Router } from "express";
import { getChats, createChat } from "../controllers/chatController";
import { auth } from "../middleware/auth";

const router = Router()

router.post('/:userId', auth(["student", "lecturer", "HOD"]), createChat)
router.get('/', auth(["student", "lecturer", "HOD"]), getChats)


export default router