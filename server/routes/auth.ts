import { Router } from "express";
import { forgotPassword, login, resetPasswordGet, resetPasswordPost } from "../controllers/authController";
import { error } from "../middleware/error";

const router = Router()

router.post('/login', error, login)
router.post('/forgot-password', forgotPassword)
router.get('/reset-password/:id/:token', resetPasswordGet)
router.post('/reset-password/:id/:token', resetPasswordPost)

export default router