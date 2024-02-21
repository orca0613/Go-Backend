import cors from "cors";
import express from "express";
import problemRoutes from "./routes/problem";
import problemInformationRoutes from "./routes/problemInformation";
import userRoutes from "./routes/user";
import userDetailRoutes from "./routes/userDetail";

const app = express()

app.use(cors())
app.use(express.json())

app.use("/problems", problemRoutes)
app.use("/users", userRoutes)
app.use("/problem-info", problemInformationRoutes)
app.use("/user-detail", userDetailRoutes)

export default app
