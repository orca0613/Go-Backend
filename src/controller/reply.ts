import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload } from "../util/helpers";
import { Reply } from "../models/reply";

export async function addReply(req: Request, res: Response, next: NextFunction) {
  const {problemId, comment, name} = req.body
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
    await Reply.create({
      problemId: problemId,
      name: name,
      comment: comment,
      time: new Date(),
      deleted: false,
      modified: false
    })
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
}

export async function deleteReply(req: Request, res: Response, next: NextFunction) {
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
    const update = await Reply.findByIdAndUpdate(id, {
      $set: {deleted: true, deletedTime: new Date()}
    })
    if (!update) {
      return res.sendStatus(404)
    }
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

