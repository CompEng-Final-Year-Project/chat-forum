import { Router } from "express";
import { auth } from "../middleware/auth";
import { getUsers } from "../controllers/usersController";

const router = Router()

router.get('/', auth(["student", "lecturer", "HOD"]), getUsers)
// router.get('/', auth(["student", "lecturer", "HOD"]), getChats)

export default router