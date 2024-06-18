import express from "express";
import { addElement, getAllCreators, getUserDetail, changeSetting } from "../controller/userDetail";

const userDetailRouter = express.Router()

userDetailRouter.patch("/add-element", addElement)
userDetailRouter.patch("/setting", changeSetting)

userDetailRouter.get("/get/:name", getUserDetail)
userDetailRouter.get("/get-creators", getAllCreators)

export default userDetailRouter
