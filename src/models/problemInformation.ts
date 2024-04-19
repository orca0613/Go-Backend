import { Schema, Types, model } from "mongoose";
import { PROBLEM_INFORMATION } from "../util/constants";

export interface ProblemInformation {
  _id: Types.ObjectId,
  problemId: string,
  problemIndex: number,
  initialState: string[][]
  level: number,
  creator: string,
  view: number,
  liked: string[],
  disliked: string[],
  correctUser: string[],
  correct: number,
  wrong: number,
  totalCorrectUserLevel: number,
  totalWrongUserLevel: number,
  time: Date,
}

const ProblemInformationSchema = new Schema<ProblemInformation>(
  {
    problemId: {
      type: String,
      required: true,
    },
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
    view: {
      type: Number,
      required: true,
    },
    liked: {
      type: [String],
      required: true,
    },
    disliked: {
      type: [String],
      required: true,
    },
    correctUser: {
      type: [String],
      required: true,
    },
    correct: {
      type: Number,
      required: true,
    },
    wrong: {
      type: Number,
      required: true,
    },
    totalCorrectUserLevel: {
      type: Number,
      required: true,
    },
    totalWrongUserLevel: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    }
  }
)

export const ProblemInformation = model<ProblemInformation>(PROBLEM_INFORMATION, ProblemInformationSchema)