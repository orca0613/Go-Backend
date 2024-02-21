import express from "express";
import { changeInfoAndPoint, addElement, deleteElement, getAllCreators, getUserDetail } from "../controller/userDetail";

const router = express.Router()

router.patch("/add-element", addElement)
router.patch("/delete-element", deleteElement)
router.patch("/change", changeInfoAndPoint)

router.get("/get/:name", getUserDetail)
router.get("/get-creators", getAllCreators)

export default router
