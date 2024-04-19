import { Schema, Types, model } from "mongoose";
import { REQUESTS } from "../util/constants";

export interface Requests {
  _id: Types.ObjectId,
  problemIdx: number,
  creator: string,
  client: string,
  key: string,
  language: number,
  time: Date,
  checked: boolean,
}

const RequestsSchema = new Schema<Requests>(
  {
    problemIdx: {
      type: Number,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    language: {
      type: Number,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
  }
)

export const Requests = model<Requests>(REQUESTS, RequestsSchema)