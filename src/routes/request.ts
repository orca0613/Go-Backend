import express from "express"
import { checkRequest, sendRequest } from "../controller/request"

const requestsRouter = express.Router()

requestsRouter.post("/send", sendRequest)

requestsRouter.patch("/check", checkRequest)
export default requestsRouter