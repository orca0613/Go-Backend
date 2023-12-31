import express from "express"
import { createProblem, deleteProblem, getAllProblems, getProblemById, getProblemByIdList, getProblemsByCreator, getProblemsByLevel, modifyProblem, updateVariations } from "../controllers/problem"

const router = express.Router()

router.post("/create", createProblem)

router.delete("/delete", deleteProblem)

router.get("/get-all", getAllProblems)
router.get("/get-by-creator/:creator", getProblemsByCreator)
router.get("/get-by-level/:level", getProblemsByLevel)
router.get("/get-by-id-list/:problemIdList", getProblemByIdList)
router.get("/get-by-id/:problemId", getProblemById)

router.patch("/update-variations", updateVariations)
router.patch("/modify-problem", modifyProblem)

export default router