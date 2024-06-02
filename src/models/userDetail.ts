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
    }
  }
)

export const UserDetail = model<UserDetail>(USER_DETAIL, UserDetailSchema)