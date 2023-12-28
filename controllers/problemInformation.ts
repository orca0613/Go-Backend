import { NextFunction, Request, Response } from "express";
import { ProblemInformation } from "../models/problemInformation";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload } from "../util/helpers";

export async function changeCount(req: Request, res: Response, next: NextFunction) {
  const problemId = req.body.problemId
  const operator = req.body.operator
  const name = req.body.name
  const bearerHeader = req.headers["authorization"]
  const secretKey = env.TOKEN_KEY?? ""
  if (!bearerHeader) {
    res.sendStatus(403)
  }
  const token = bearerHeader?.split(" ")[1]
  jwt.verify(token?? "", secretKey, async (err, auth) => {
    if (err) {
      res.sendStatus(403)
    }
    if (isJWTPayload(auth, name)) {
      let inc = undefined
      try {
        switch (operator) {
          case "view":
            // inc = {view: 1}
            await ProblemInformation.updateOne({
              problemId: problemId
            }, {
              $inc: {view: 1}
            })
            break
          case "like":
            await ProblemInformation.updateOne({
              problemId: problemId
            }, {
              $inc: {like: 1}
            })
            break
          case "deductLike":
            await ProblemInformation.updateOne({
              problemId: problemId
            }, {
              $inc: {like: -1}
            })
            break
          case "dislike":
            await ProblemInformation.updateOne({
              problemId: problemId
            }, {
              $inc: {dislike: 1}
            })
            break
          case "deductDislike":
            await ProblemInformation.updateOne({
              problemId: problemId
            }, {
              $inc: {dislike: -1}
            })
            break
          case "correct":
            await ProblemInformation.updateOne({
              problemId: problemId
            }, {
              $inc: {correct: 1}
            })
            break
          case "wrong":
            await ProblemInformation.updateOne({
              problemId: problemId
            }, {
              $inc: {wrong: 1}
            })
            break
          default:
            break
        }
        // if (inc) {
        //   await ProblemInformation.updateOne({
        //     problemId: problemId
        //   }, {
        //     $inc: inc
        //   })
        // }
        res.status(200).send({ response: "added" })
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function getProblemInformations(req: Request, res: Response, next: NextFunction) {
  const problemId = req.params.problemId
  try {
    const info = await ProblemInformation.findOne({problemId: problemId})
    if (!info) {
      res.status(400).json({})
    }
    res.status(200).json(info)
  } catch (error) {
    next(error)
  }
}

export async function addReply(req: Request, res: Response, next: NextFunction) {
  const problemId = req.body.problemId
  const reply = req.body.reply
  const name = req.body.name
  const bearerHeader = req.headers["authorization"]
  const secretKey = env.TOKEN_KEY?? ""
  if (!bearerHeader) {
    res.sendStatus(403)
  }
  const token = bearerHeader?.split(" ")[1]
  jwt.verify(token?? "", secretKey, async (err, auth) => {
    if (err) {
      res.sendStatus(403)
    } 
    if (isJWTPayload(auth, name)) {
      try {
        await ProblemInformation.updateOne({
          problemId: problemId
        }, {
          $push: {reply: reply}
        })
        res.status(200).send({response: "Your reply has been registered"})
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function getReply(req: Request, res: Response, next: NextFunction) {
  const problemId = req.params.problemId
  try {
    const question = await ProblemInformation.findOne({problemId: problemId})
    res.status(200).json(question?.reply)
  } catch (error) {
    next(error)
  }
}
