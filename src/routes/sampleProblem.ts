import express from "express"
import { getSampleProblemsByIndexList, getSampleProblemsByFilter, handleLiked, getSampleProblemByIdx, getRecommendedProblem, getNewestProblem, getRepresentativeProblem, getSolvedProblem } from "../controller/sampleProblem"

const sampleProblemRouter = express.Router()

sampleProblemRouter.get("/get-by-idx-list/:problemIndexList", getSampleProblemsByIndexList)
sampleProblemRouter.get("/get-by-filter/:filter", getSampleProblemsByFilter)
sampleProblemRouter.get("/get-by-index/:problemIndex", getSampleProblemByIdx)
sampleProblemRouter.get("/get-recommended/:name", getRecommendedProblem)
sampleProblemRouter.get("/get-newest", getNewestProblem)
sampleProblemRouter.get("/get-representative/:name", getRepresentativeProblem)
sampleProblemRouter.get("/get-solved/:name", getSolvedProblem)

sampleProblemRouter.patch("/handle-liked", handleLiked)


export default sampleProblemRouter