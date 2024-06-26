import { Schema, Types, model } from "mongoose";
import { USER } from "../util/constants";

export interface User {
  _id: Types.ObjectId,
  email: string,
  password: string,
  name: string,
  level: number,
  verify: boolean,
  language: number,
  time: Date,
  loginTime: Date,
}

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: Number,
      required: true,
    },
    verify: {
      type: Boolean,
      required: true,
      default: false,
    },
    language: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: false,
    },
    loginTime: {
      type: Date,
      required: false,
    },

  }
)

export const User = model<User>(USER, UserSchema)