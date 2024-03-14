import express from "express"
import { addCorrectUser, addReply, addUsername, addWrong, changeCount, deleteUsername, getAllProblems, getProblemByIdList, getProblemByFilter, getProblemInformations, getProblemsByCreator, getProblemsByLevel, getRecommendedProblem, getReply } from "../controller/problemInformation"

const router = express.Router()

router.patch("/change-count", changeCount)
router.patch("/add-reply", addReply)
router.patch("/add-name", addUsername)
router.patch("/delete-name", deleteUsername)
router.patch("/add-correct", addCorrectUser)
router.patch("/add-wrong", addWrong)

router.get("/get/:problemId", getProblemInformations)
router.get("/get-reply/:problemId", getReply)
router.get("/get-recommended", getRecommendedProblem)
router.get("/get-all", getAllProblems)
router.get("/get-by-creator/:creator", getProblemsByCreator)
router.get("/get-by-level/:level", getProblemsByLevel)
router.get("/get-by-id-list/:problemIdList", getProblemByIdList)
router.get("/get-by-filter/:info", getProblemByFilter)

export default router