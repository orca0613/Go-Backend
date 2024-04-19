import express from "express"
import { checkMessage, getMessageById, getMessageByReceiver, getMessageBySender, getNumberUncheckedMessages, sendMessage } from "../controller/message"

const messageRouter = express.Router()

messageRouter.post("/send", sendMessage)

messageRouter.patch("/check", checkMessage)

messageRouter.get("/get-by-sender/:sender", getMessageBySender)
messageRouter.get("/get-by-receiver/:receiver", getMessageByReceiver)
messageRouter.get("/get-by-id/:id", getMessageById)
messageRouter.get("/get-unchecked/:name", getNumberUncheckedMessages)

export default messageRouter
