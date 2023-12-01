import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

export default app