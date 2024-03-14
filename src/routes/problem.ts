import express from "express"
import { createProblem, deleteProblem, getProblemById, modifyProblem, updateVariations } from "../controller/problem"

const router = express.Router()

router.post("/create", createProblem)

router.delete("/delete", deleteProblem)

router.get("/get-by-id/:problemId", getProblemById)

router.patch("/update-variations", updateVariations)
router.patch("/modify-problem", modifyProblem)

export default router