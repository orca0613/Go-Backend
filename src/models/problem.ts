import { Schema, Types, model } from "mongoose";
import { PROBLEM, initialVariations } from "../util/constants";

export interface Problem {
  _id: Types.ObjectId,
  problemIdx: number,
  initialState: string[][],
  variations: object,
  answers: object,
  questions: object,
  creator: string, // del
  comment: string, // del
  color: string,
  level: number, // del
  time: Date,
}

const ProblemSchema = new Schema<Problem>(
  {
    problemIdx: {
      type: Number,
      required: true,
    },
    initialState: {
      type: [[String]],
      required: true,
    },
    variations: {
      type: Object,
      required: true,
      default: initialVariations,
    },
    answers: {
      type: Object,
      required: true,
      default: initialVariations,
    },
    questions: {
      type: Object,
      required: true,
      default: initialVariations,
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