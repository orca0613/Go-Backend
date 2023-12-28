import { Schema, Types, model } from "mongoose";
import { PROBLEM_INFORMATION } from "../util/constants";

export interface ProblemInformation {
  _id: Types.ObjectId,
  problemId: string,
  view: number,
  like: number,
  dislike: number,
  correct: number,
  wrong: number,
  reply?: object[]
}

const ProblemInformationSchema = new Schema<ProblemInformation>(
  {
    problemId: {
      type: String,
      required: true,
    },
    view: {
      type: Number,
      required: true,
    },
    like: {
      type: Number,
      required: true,
    },
    dislike: {
      type: Number,
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
    reply: {
      type: [Object],
    },
  }
)

export const ProblemInformation = model<ProblemInformation>(PROBLEM_INFORMATION, ProblemInformationSchema)