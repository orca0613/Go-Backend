import { Schema, Types, model } from "mongoose";
import { REFRESH_TOKEN } from "../util/constants";

export interface RefreshToken {
  _id: Types.ObjectId,
  name: string,
  token: string,
  createdAt: Date,
}

const RefreshTokenSchema = new Schema<RefreshToken>(
  {
    name: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "1y"
    }
  }
)

export const RefreshToken = model<RefreshToken>(REFRESH_TOKEN, RefreshTokenSchema)