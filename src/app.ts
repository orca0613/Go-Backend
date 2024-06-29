import app from "./util/middlewareApp";
import problemRouter from "./routes/problem"
import userRouter from "./routes/user"
import problemInformationRouter from "./routes/problemInformation"
import userDetailRouter from "./routes/userDetail"
import replyRouter from "./routes/reply";
import messageRouter from "./routes/message";
import requestsRouter from "./routes/request";
import sampleProblemRouter from "./routes/sampleProblem";

export default app

app.use("/problems", problemRouter)
app.use("/users", userRouter)
app.use("/problem-info", problemInformationRouter)
app.use("/user-detail", userDetailRouter)
app.use("/reply", replyRouter)
app.use("/message", messageRouter)
app.use("/requests", requestsRouter)
app.use("/sample", sampleProblemRouter)