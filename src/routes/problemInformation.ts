import express from "express"
import { addCorrectUser, addUsername, addWrong, changeCount, deleteUsername, getProblemInformations, getRecommendedProblem, handleLiked, getNewestProblem, getRepresentativeProblem, getSolvedProblem } from "../controller/problemInformation"

const problemInformationRouter = express.Router()

problemInformationRouter.patch("/change-count", changeCount)
problemInformationRouter.patch("/add-name", addUsername)
problemInformationRouter.patch("/delete-name", deleteUsername)
problemInformationRouter.patch("/add-correct", addCorrectUser)
problemInformationRouter.patch("/add-wrong", addWrong)
problemInformationRouter.patch("/handle-liked", handleLiked)

problemInformationRouter.get("/get/:problemIdx", getProblemInformations)
problemInformationRouter.get("/get-recommended/:name", getRecommendedProblem)
problemInformationRouter.get("/get-newest", getNewestProblem)
problemInformationRouter.get("/get-representative/:name", getRepresentativeProblem)
problemInformationRouter.get("/get-solved/:name", getSolvedProblem)


export default problemInformationRouter