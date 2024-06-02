import express from "express"
import { addCorrectUser, addWrong, changeCount, getProblemInformations } from "../controller/problemInformation"

const problemInformationRouter = express.Router()

problemInformationRouter.patch("/change-count", changeCount)
problemInformationRouter.patch("/add-correct", addCorrectUser)
problemInformationRouter.patch("/add-wrong", addWrong)

problemInformationRouter.get("/get/:problemIdx", getProblemInformations)



export default problemInformationRouter