import { Schema, Types, model } from "mongoose";
import { USER } from "../util/constants";

export interface User {
  _id: Types.ObjectId,
  email: string,
  password: string,
  name: string,
  level: number,
}

const UserSchema = new Schema<User>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  }
)

export const User = model<User>(USER, UserSchema)