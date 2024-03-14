import { Schema, Types, model } from "mongoose";
import { PROBLEM } from "../util/constants";

export interface Problem {
  _id: Types.ObjectId,
  initialState: string[][],
  variations: object,
  answers: object,
  questions: object,
  creator: string,
  comment: string,
  color: string,
  level: number,
  time: Date,
}

const ProblemSchema = new Schema<Problem>(
  {
    initialState: {
      type: [[String]],
      required: true,
    },
    variations: {
      type: Object,
      required: true,
    },
    answers: {
      type: Object,
      required: true,
    },
    questions: {
      type: Object,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    color: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  }
)

export const Problem = model<Problem>(PROBLEM, ProblemSchema)