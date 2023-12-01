import express from "express";
import { checkDuplicateEmail, checkDuplicateName, createUser, login } from "../controllers/user";

const router = express.Router()

router.post("/create", createUser)
router.post("/login", login)

router.get("/check-email/:email", checkDuplicateEmail)
router.get("/check-name/:name", checkDuplicateName)

export default router