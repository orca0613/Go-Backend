import { Schema, Types, model } from "mongoose";
import { HARDEST_SAMPLE_PROBLEM } from "../util/constants";

export interface HardestSampleProblem {
  _id: Types.ObjectId,
  problemIndex: number,
  initialState: string[][]
  level: number,
  creator: string,
  time: Date,
  liked: number,
}

const HardestSampleProblemSchema = new Schema<HardestSampleProblem>(
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

export const HardestSampleProblem = model<HardestSampleProblem>(HARDEST_SAMPLE_PROBLEM, HardestSampleProblemSchema)