import { Schema, Types, model } from "mongoose";
import { PROBLEM_INFORMATION } from "../util/constants";

export interface ProblemInformation {
  _id: Types.ObjectId,
  problemIndex: number,
  level: number,
  creator: string,
  view: number,
  correctUser: string[],
  correct: number,
  wrong: number,
  totalCorrectUserLevel: number,
  totalWrongUserLevel: number,
  time: Date,
}

const ProblemInformationSchema = new Schema<ProblemInformation>(
  {
    problemIndex: {
      type: Number,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    creator: {
      type: String,
      required: true,
      index: true,
    },
    view: {
      type: Number,
      required: true,
      default: 0,
    },
    correctUser: {
      type: [String],
      required: true,
      default: [],
    },
    correct: {
      type: Number,
      required: true,
      default: 0
    },
    wrong: {
      type: Number,
      required: true,
      default: 0,
    },
    totalCorrectUserLevel: {
      type: Number,
      required: true,
      default: 0,
    },
    totalWrongUserLevel: {
      type: Number,
      required: true,
      default: 0,
    },
    time: {
      type: Date,
      required: true,
    },
  }
)

export const ProblemInformation = model<ProblemInformation>(PROBLEM_INFORMATION, ProblemInformationSchema)