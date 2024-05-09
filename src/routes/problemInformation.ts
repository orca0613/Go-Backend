import express from "express"
import { addCorrectUser, addUsername, addWrong, changeCount, deleteUsername, getProblemByIndexList, getProblemByFilter, getProblemInformations, getRecommendedProblem, deleteReply, handleLiked, getNewestProblem, getRepresentativeProblem, getSolvedProblem } from "../controller/problemInformation"

const problemInformationRouter = express.Router()

problemInformationRouter.patch("/change-count", changeCount)
problemInformationRouter.patch("/add-name", addUsername)
problemInformationRouter.patch("/delete-name", deleteUsername)
problemInformationRouter.patch("/add-correct", addCorrectUser)
problemInformationRouter.patch("/add-wrong", addWrong)
problemInformationRouter.patch("/delete", deleteReply)
problemInformationRouter.patch("/handle-liked", handleLiked)

problemInformationRouter.get("/get/:problemIdx", getProblemInformations)
problemInformationRouter.get("/get-recommended/:name", getRecommendedProblem)
problemInformationRouter.get("/get-by-idx-list/:problemIndexList", getProblemByIndexList)
problemInformationRouter.get("/get-by-filter/:filter", getProblemByFilter)
problemInformationRouter.get("/get-newest", getNewestProblem)
problemInformationRouter.get("/get-representative/:name", getRepresentativeProblem)
problemInformationRouter.get("/get-solved/:name", getSolvedProblem)


export default problemInformationRouter