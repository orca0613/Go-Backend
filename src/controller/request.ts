import { NextFunction, Request, Response } from "express";
import { getRequestCheckNoticeForm, isValidMember } from "../util/helpers";
import { Requests } from "../models/request";
import { HOME } from "../util/constants";
import { Message } from "../models/message";

export async function sendRequest(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, creator, client, key, language} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, client)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Requests.create({
      problemIdx: problemIdx,
      creator: creator,
      client: client,
      key: key,
      language: language,
      time: new Date(),
    })
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
}

export async function checkRequest(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, creator, key} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, creator)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Requests.updateMany({problemIdx: problemIdx, creator: creator, key: key}, {
      checked: true
    })
    const w = await Requests.find({problemIdx: problemIdx, creator: creator, key: key})
    w.map(async a => {
      const [greeting, form] = getRequestCheckNoticeForm(a.creator, problemIdx, a.language)
      await Message.create({
        sender: "admin",
        receiver: a.client,
        title: greeting,
        contents: form,
        quotation: "",
        time: new Date(),
        includeUrl: true,
      })
    })

    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

