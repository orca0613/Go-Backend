import express from "express";
import { checkDuplicateEmail, checkDuplicateName, createUser, login, verifyMail } from "../controller/user";

const router = express.Router()

router.post("/create", createUser)
router.post("/login", login)

router.get("/check-email/:email", checkDuplicateEmail)
router.get("/check-name/:name", checkDuplicateName)

router.patch("/verify/:userId", verifyMail)

export default router