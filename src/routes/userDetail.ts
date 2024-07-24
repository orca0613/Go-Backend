import express from "express";
import { getAllCreators, getUserDetail, changeSetting, addTried, addSolved } from "../controller/userDetail";

const userDetailRouter = express.Router()

userDetailRouter.patch("/add-tried", addTried)
userDetailRouter.patch("/add-solved", addSolved)
userDetailRouter.patch("/setting", changeSetting)

userDetailRouter.get("/get/:name", getUserDetail)
userDetailRouter.get("/get-creators", getAllCreators)

export default userDetailRouter
