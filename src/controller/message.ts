import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload } from "../util/helpers";
import { Message } from "../models/message";

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  const {sender, receiver, title, contents, quotation} = req.body
  const bearerHeader = req.headers["authorization"]
  const secretKey = env.TOKEN_KEY?? ""
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const token = bearerHeader?.split(" ")[1]
  try {
    const auth = await new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.sendStatus(401);
        } 
        resolve(decoded);
      });
    });
    if (!isJWTPayload(auth, sender)) {
      return res.sendStatus(403);
    }
    const newMessage = await Message.create({
      sender: sender,
      receiver: receiver,
      title: title,
      contents: contents,
      quotation: quotation,
      time: new Date(),
      checked: false,
      hideToReceiver: false,
      hideToSender:false,
      includeUrl: false,
    })
    res.status(201).json(newMessage)
  } catch (error) {
    next(error)
  }
}

export async function checkMessage(req: Request, res: Response, next: NextFunction) {
  const {id, name} = req.body
  const bearerHeader = req.headers["authorization"]
  const secretKey = env.TOKEN_KEY?? ""
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const token = bearerHeader?.split(" ")[1]
  try {
    const auth = await new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.sendStatus(401);
        } 
        resolve(decoded);
      });
    });
    if (!isJWTPayload(auth, name)) {
      return res.sendStatus(403);
    }
    await Message.findOneAndUpdate({_id: id, receiver: name}, {
      checked: true
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function getMessageBySender(req: Request, res: Response, next: NextFunction) {
  const sender = req.params.sender
  try {
    const messageList = await Message.find({sender: sender, hideToSender: false}).sort({time: -1})
    res.status(200).json(messageList)
  } catch (error) {
    next(error)
  }
}

export async function getMessageByReceiver(req: Request, res: Response, next: NextFunction) {
  const receiver = req.params.receiver
  try {
    const messageList = await Message.find({receiver: receiver, hideToReceiver: false}).sort({time: -1})
    res.status(200).json(messageList)
  } catch (error) {
    next(error)
  }
}

export async function getMessageById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id
  try {
    const messageList = await Message.findById(id)
    res.status(200).json(messageList)
  } catch (error) {
    next(error)
  }
}

export async function getNumberUncheckedMessages(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const unchecked = await Message.countDocuments({receiver: name, checked: false, hideToReceiver: false})
    res.status(200).json(unchecked)
  } catch (error) {
    next(error)
  }
}



