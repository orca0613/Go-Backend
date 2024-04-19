import express from "express";
import { changePassword, checkDuplicateEmail, checkDuplicateName, checkEmailAndSendUrl, checkPasswordAndReturnId, createUser, login, verifyMail } from "../controller/user";

const userRouter = express.Router()

userRouter.post("/create", createUser)
userRouter.post("/login", login)

userRouter.get("/check-email/:email", checkDuplicateEmail)
userRouter.get("/check-name/:name", checkDuplicateName)
userRouter.get("/check-password/:info", checkPasswordAndReturnId)
userRouter.get("/check-mail/:email", checkEmailAndSendUrl)

userRouter.patch("/verify/:userId", verifyMail)
userRouter.patch("/change-password", changePassword)

export default userRouter