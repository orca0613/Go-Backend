import express from "express"
import { checkMessage, getMessageById, getMessageByReceiver, getMessageBySender, getNumberUncheckedMessages, hideMessage, sendMessage } from "../controller/message"

const messageRouter = express.Router()

messageRouter.post("/send", sendMessage)
// messageRouter.post("/suggest-test", sendSuggestMessage)

messageRouter.patch("/check", checkMessage)
messageRouter.patch("/hide-message", hideMessage)

messageRouter.get("/get-by-sender/:sender", getMessageBySender)
messageRouter.get("/get-by-receiver/:receiver", getMessageByReceiver)
messageRouter.get("/get-by-id/:id", getMessageById)
messageRouter.get("/get-unchecked/:name", getNumberUncheckedMessages)

export default messageRouter
