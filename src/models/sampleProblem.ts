import { Schema, Types, model } from "mongoose";
import { SAMPLE_PROBLEM } from "../util/constants";

export interface SampleProblem {
  _id: Types.ObjectId,
  problemIndex: number,
  initialState: string[][]
  level: number,
  creator: string,
  liked: number,
  tier: number,
}

const SampleProblemSchema = new Schema<SampleProblem>(
  {
    problemIndex: {
      type: Number,
      required: true,
      index: true,
    },
    initialState: {
      type: [[String]],
      required: true
    },
    level: {
      type: Number,
      required: true,
      index: true,
    },
    creator: {
      type: String,
      required: true,
      index: true,
    },
    liked: {
      type: Number,
      required: true,
      default: 0,
    },
    tier: {
      type: Number,
      required: true,
      index: true,
    }
  },
  {
    timestamps: true
  }
)

export const SampleProblem = model<SampleProblem>(SAMPLE_PROBLEM, SampleProblemSchema)