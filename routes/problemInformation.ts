import express from "express"
import { addReply, addUsername, changeCount, deleteUsername, getProblemInformations, getReply } from "../controllers/problemInformation"

const router = express.Router()

router.patch("/change-count", changeCount)
router.patch("/add-reply", addReply)
router.patch("/add-name", addUsername)
router.patch("/delete-name", deleteUsername)

router.get("/get/:problemId", getProblemInformations)
router.get("/get-reply/:problemId", getReply)

export default router