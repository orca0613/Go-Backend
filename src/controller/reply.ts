import { NextFunction, Request, Response } from "express";
import { isValidMember } from "../util/helpers";
import { Reply } from "../models/reply";

export async function addReply(req: Request, res: Response, next: NextFunction) {
  const {problemId, comment, name} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, name)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Reply.create({
      problemId: problemId,
      name: name,
      comment: comment,
      time: new Date(),
    })
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
}

export async function hideReply(req: Request, res: Response, next: NextFunction) {
  const {id, name} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, name)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Reply.findByIdAndUpdate(id, {
      $set: {deleted: true, deletedTime: new Date()}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function getReplies(req: Request, res: Response, next: NextFunction) {
  const problemId = req.params.problemId
  try {
    const replies = await Reply.find({ problemId: problemId }).sort({time: 1})
    res.status(200).json(replies)
  } catch (error) {
    next(error)
  }
}

