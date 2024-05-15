import { Schema, Types, model } from "mongoose";
import { EASIEST_SAMPLE_PROBLEM, EASY_SAMPLE_PROBLEM } from "../util/constants";

export interface EasiestSampleProblem {
  _id: Types.ObjectId,
  problemIndex: number,
  initialState: string[][]
  level: number,
  creator: string,
  time: Date,
  liked: number,
}

const EasiestSampleProblemSchema = new Schema<EasiestSampleProblem>(
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

export const EasiestSampleProblem = model<EasiestSampleProblem>(EASIEST_SAMPLE_PROBLEM, EasiestSampleProblemSchema)