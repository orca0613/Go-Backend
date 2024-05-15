import { Schema, Types, model } from "mongoose";
import { HARD_SAMPLE_PROBLEM } from "../util/constants";

export interface HardSampleProblem {
  _id: Types.ObjectId,
  problemIndex: number,
  initialState: string[][]
  level: number,
  creator: string,
  time: Date,
  liked: number,
}

const HardSampleProblemSchema = new Schema<HardSampleProblem>(
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

export const HardSampleProblem = model<HardSampleProblem>(HARD_SAMPLE_PROBLEM, HardSampleProblemSchema)