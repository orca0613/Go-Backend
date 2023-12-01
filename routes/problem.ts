import express from "express"
import { createProblem, deleteProblem, getAllProblems, getProblemsByCreator, getProblemsByLevel, updateVariations } from "../controllers/problem"

const router = express.Router()

router.post("/create", createProblem)

router.delete("/delete/:id", deleteProblem)

router.get("/get-all-problems", getAllProblems)
router.get("/get-problems-by-creator/:creator", getProblemsByCreator)
router.get("/get-problems-by-level/:level", getProblemsByLevel)

router.patch("/update-variations", updateVariations)

export default router