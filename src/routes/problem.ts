import express from "express"
import { createProblem, deleteProblem, getProblemByIdx, modifyProblem, updateVariations } from "../controller/problem"

const problemRouter = express.Router()

problemRouter.post("/create", createProblem)

problemRouter.delete("/delete", deleteProblem)

problemRouter.get("/get-by-idx/:problemIdx", getProblemByIdx)

problemRouter.patch("/update-variations", updateVariations)
problemRouter.patch("/modify-problem", modifyProblem)

export default problemRouter