import express from "express"
import { addCorrectUser, addReply, addUsername, addWrong, changeCount, deleteUsername, getProblemInformations, getReply } from "../controller/problemInformation"

const router = express.Router()

router.patch("/change-count", changeCount)
router.patch("/add-reply", addReply)
router.patch("/add-name", addUsername)
router.patch("/delete-name", deleteUsername)
router.patch("/add-correct", addCorrectUser)
router.patch("/add-wrong", addWrong)

router.get("/get/:problemId", getProblemInformations)
router.get("/get-reply/:problemId", getReply)

export default router