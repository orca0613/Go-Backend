import { Schema, Types, model } from "mongoose";
import { USER_DETAIL } from "../util/constants";

export interface UserDetail {
  _id: Types.ObjectId,
  name: string,
  point: number,
  created: string[],
  withQuestions: string[],
  tried: string[],
  solved: string[],
  liked: string[],
  disliked: string[],
  asked: string[],
  loginTime: Date,
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
      type: [String],
      required: true,
    },
    withQuestions: {
      type: [String],
      required: true,
    },
    tried: {
      type: [String],
      required: true,
    },
    solved: {
      type: [String],
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
    asked: {
      type: [String],
      required: true,
    },
    loginTime: {
      type: Date,
      required: false,
    },
  }
)

export const UserDetail = model<UserDetail>(USER_DETAIL, UserDetailSchema)