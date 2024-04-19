import { Schema, Types, model } from "mongoose";
import { MESSAGE } from "../util/constants";

export interface Message {
  _id: Types.ObjectId,
  sender: string,
  receiver: string,
  title: string,
  contents: string,
  quotation: string,
  time: Date,
  checked: boolean,
  hideToReceiver: boolean,
  hideToSender: boolean,
  includeUrl: boolean,
}

const MessageSchema = new Schema<Message>(
  {
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
    quotation: {
      type: String,
      required: false,
    },
    time: {
      type: Date,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
    },
    hideToReceiver: {
      type: Boolean,
      required: true,
    },
    hideToSender: {
      type: Boolean,
      required: true,
    },
    includeUrl: {
      type: Boolean,
      required: true
    },
  }
)

export const Message = model<Message>(MESSAGE, MessageSchema)