import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { getRequestCheckNoticeForm, isJWTPayload } from "../util/helpers";
import { Requests } from "../models/requests";
import { HOME } from "../util/constants";
import { Message } from "../models/message";

export async function sendRequest(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, creator, client, key, language} = req.body
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
    if (!isJWTPayload(auth, client)) {
      return res.sendStatus(403);
    }
    const newRequest = await Requests.create({
      problemIdx: problemIdx,
      creator: creator,
      client: client,
      key: key,
      language: language,
      time: new Date(),
      checked: false
    })
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
}

export async function checkRequest(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, creator, key} = req.body
  const url = `${HOME}problem/${problemIdx}`
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
    if (!isJWTPayload(auth, creator)) {
      return res.sendStatus(403);
    }
    await Requests.updateMany({problemIdx: problemIdx, creator: creator, key: key}, {
      checked: true
    })
    const w = await Requests.find({problemIdx: problemIdx, creator: creator, key: key})
    w.map(async a => {
      const [greeting, form] = getRequestCheckNoticeForm(a.creator, url, a.language)

      const newMessage = await Message.create({
        sender: "admin",
        receiver: a.client,
        title: greeting,
        contents: form,
        quotation: "",
        time: new Date(),
        checked: false,
        hideToReceiver: false,
        hideToSender: false,
        includeUrl: true,
      })
    })

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

