import { Schema, Types, model } from "mongoose";
import { USER_DETAIL } from "../util/constants";

export interface UserDetail {
  _id: Types.ObjectId,
  name: string,
  point: number,
  created: number[],
  withQuestions: number[],
  tried: number[],
  solved: number[],
  liked: number[],
  auto: boolean,
  level: number,
  totalLike: number,
  wrong: object,
  wrongPerLevel: object,
  correctPerLevel: object,
  totalWrong: number,
  totalCorrect: number,

}

const UserDetailSchema = new Schema<UserDetail>(
  {
    name: {
      type: String,
      required: true,
    },
    point: {
      type: Number,
      required: true,
      default: 10000,
    },
    created: {
      type: [Number],
      required: true,
    },
    withQuestions: {
      type: [Number],
      required: true,
    },
    tried: {
      type: [Number],
      required: true,
    },
    solved: {
      type: [Number],
      required: true,
    },
    liked: {
      type: [Number],
      required: true,
    },
    auto: {
      type: Boolean,
      required: true,
      default: false,
    },
    level: {
      type: Number,
      required: true,
    },
    totalLike: {
      type: Number,
      required: true,
      default: 0,
    },
    wrong: {
      type: Object,
      required: true,
      default: {}
    },
    wrongPerLevel: {
      type: Object,
      required: true,
      default: {}
    },
    correctPerLevel: {
      type: Object,
      required: true,
      default: {}
    },
    totalWrong: {
      type: Number,
      required: true,
      default: 0
    },
    totalCorrect: {
      type: Number,
      required: true,
      default: 0
    }
  }
)

export const UserDetail = model<UserDetail>(USER_DETAIL, UserDetailSchema)