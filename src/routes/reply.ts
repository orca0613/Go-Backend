import express from "express"
import { addReply, getReplies, hideReply } from "../controller/reply"

const replyRouter = express.Router()

replyRouter.post("/add", addReply)

replyRouter.get("/get/:problemId", getReplies)

replyRouter.patch("/hide", hideReply)

export default replyRouter