import { Schema, Types, model } from "mongoose";
import { MIDDLE_SAMPLE_PROBLEM } from "../util/constants";

export interface MiddleSampleProblem {
  _id: Types.ObjectId,
  problemIndex: number,
  initialState: string[][]
  level: number,
  creator: string,
  time: Date,
  liked: number,
}

const MiddleSampleProblemSchema = new Schema<MiddleSampleProblem>(
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

export const MiddleSampleProblem = model<MiddleSampleProblem>(MIDDLE_SAMPLE_PROBLEM, MiddleSampleProblemSchema)