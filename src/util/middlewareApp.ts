
import cors from "cors";
import express from "express";
import morgan from "morgan";

const corsOption = {
  origin: ['https://go-problem-test.web.app', 'http://localhost:5173'], // 허용할 출처
  methods: ['GET, POST, PATCH, DELETE'], // 허용할 HTTP 메서드
  allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더
};
const app = express()
app.use(cors(corsOption))
// app.use(morgan("short")) // for request logs
app.use(express.json())


export default app