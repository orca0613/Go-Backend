import express from "express"
import { addReply, deleteReply, getReplies } from "../controller/reply"

const replyRouter = express.Router()

replyRouter.post("/add", addReply)

replyRouter.get("/get/:problemId", getReplies)

replyRouter.patch("/delete", deleteReply)

export default replyRouter