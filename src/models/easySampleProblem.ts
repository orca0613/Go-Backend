import { Schema, Types, model } from "mongoose";
import { EASY_SAMPLE_PROBLEM, HARD_SAMPLE_PROBLEM } from "../util/constants";

export interface EasySampleProblem {
  _id: Types.ObjectId,
  problemIndex: number,
  initialState: string[][]
  level: number,
  creator: string,
  time: Date,
  liked: number,
}

const EasySampleProblemSchema = new Schema<EasySampleProblem>(
  {
    problemIndex: {
      type: Number,
      required: true,
    },
    initialState: {
      type: [[String]],
      required: true
    },
    level: {
      type: Number,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    liked: {
      type: Number,
      required: true,
    },
  }
)

export const EasySampleProblem = model<EasySampleProblem>(EASY_SAMPLE_PROBLEM, EasySampleProblemSchema)