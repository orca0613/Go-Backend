import express from "express";
import { addElement, deleteElement, getAllCreators, getUserDetail, changeSetting } from "../controller/userDetail";

const userDetailRouter = express.Router()

userDetailRouter.patch("/add-element", addElement)
userDetailRouter.patch("/delete-element", deleteElement)
userDetailRouter.patch("/setting", changeSetting)

userDetailRouter.get("/get/:name", getUserDetail)
userDetailRouter.get("/get-creators", getAllCreators)

export default userDetailRouter
