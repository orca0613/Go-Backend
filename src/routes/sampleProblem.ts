import express from "express"
import { getSampleProblemsByTier, getSampleProblemsByIndexList, getSampleProblemsByLevel, getSampleProblemsByFilter } from "../controller/sampleProblem"

const sampleProblemRouter = express.Router()

sampleProblemRouter.get("/get-by-level/:level", getSampleProblemsByLevel)
sampleProblemRouter.get("/get-by-tier/:tier", getSampleProblemsByTier)
sampleProblemRouter.get("/get-by-idx-list/:problemIndexList", getSampleProblemsByIndexList)
sampleProblemRouter.get("/get-by-filter/:filter", getSampleProblemsByFilter)

export default sampleProblemRouter