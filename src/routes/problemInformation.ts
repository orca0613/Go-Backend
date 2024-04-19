import express from "express"
import { addCorrectUser, addUsername, addWrong, changeCount, deleteUsername, getProblemByIndexList, getProblemByFilter, getProblemInformations, getRecommendedProblem, deleteReply } from "../controller/problemInformation"

const problemInformationRouter = express.Router()

problemInformationRouter.patch("/change-count", changeCount)
problemInformationRouter.patch("/add-name", addUsername)
problemInformationRouter.patch("/delete-name", deleteUsername)
problemInformationRouter.patch("/add-correct", addCorrectUser)
problemInformationRouter.patch("/add-wrong", addWrong)
problemInformationRouter.patch("/delete", deleteReply)

problemInformationRouter.get("/get/:problemIdx", getProblemInformations)
problemInformationRouter.get("/get-recommended", getRecommendedProblem)
problemInformationRouter.get("/get-by-idx-list/:problemIndexList", getProblemByIndexList)
problemInformationRouter.get("/get-by-filter/:filter", getProblemByFilter)

export default problemInformationRouter