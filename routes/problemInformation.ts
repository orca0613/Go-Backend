import express from "express"
import { addReply, changeCount, getProblemInformations, getReply } from "../controllers/problemInformation"

const router = express.Router()

router.patch("/change-count", changeCount)
router.patch("/add-reply", addReply)

router.get("/get/:problemId", getProblemInformations)
router.get("/get-reply/:problemId", getReply)

export default router