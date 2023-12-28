import app from "./util/middlewareApp";
import problemRoutes from "./routes/problem"
import userRoutes from "./routes/user"
import problemInformationRoutes from "./routes/problemInformation"
import userDetailRoutes from "./routes/userDetail"

export default app

app.use("/problems", problemRoutes)
app.use("/users", userRoutes)
app.use("/problem-info", problemInformationRoutes)
app.use("/user-detail", userDetailRoutes)