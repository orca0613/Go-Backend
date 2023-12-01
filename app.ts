import app from "./util/middlewareApp";
import problemRoutes from "./routes/problem"
import userRoutes from "./routes/user"

export default app

app.use("/problems", problemRoutes)
app.use("/users", userRoutes)