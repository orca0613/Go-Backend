import express from "express";
import { addElement, changePoint, deleteElement, getAllCreators, getUserDetail } from "../controllers/userDetail";

const router = express.Router()

router.patch("/add-element", addElement)
router.patch("/change-point", changePoint)
router.patch("/delete-element", deleteElement)

router.get("/get/:name", getUserDetail)
router.get("/get-creators", getAllCreators)

export default router
