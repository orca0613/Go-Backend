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
  disliked: number[],
  asked: number[],
  myFollowers: string[],
  followList: string[],
  loginTime: Date,
  auto: boolean,
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
    disliked: {
      type: [Number],
      required: true,
    },
    asked: {
      type: [Number],
      required: true,
    },
    myFollowers: {
      type: [String],
      required: true,
    },
    followList: {
      type: [String],
      required: true,
    },
    loginTime: {
      type: Date,
      required: false,
    },
    auto: {
      type: Boolean,
      required: true,
    },
  }
)

export const UserDetail = model<UserDetail>(USER_DETAIL, UserDetailSchema)