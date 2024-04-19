import { Schema, Types, model } from "mongoose";
import { REPLY } from "../util/constants";

export interface Reply {
  _id: Types.ObjectId,
  problemId: string,
  name: string,
  comment: string,
  time: Date,
  deleted: boolean,
  deletedTime: Date,
  modified: boolean,
  modifiedTime: Date,
}

const ReplySchema = new Schema<Reply>(
  {
    problemId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    deleted: {
      type: Boolean,
      required: true,
    },
    deletedTime: {
      type: Date,
      required: false,
    },
    modified: {
      type: Boolean,
      required: true,
    },
    modifiedTime: {
      type: Date,
      required: false,
    },
  }
)

export const Reply = model<Reply>(REPLY, ReplySchema)