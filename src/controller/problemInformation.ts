import { NextFunction, Request, Response } from "express";
import { ProblemInformation } from "../models/problemInformation";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload } from "../util/helpers";


export async function changeCount(req: Request, res: Response, next: NextFunction) {
  const {problemId, where, name, count} = req.body
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
          $inc: {[where]: count}
        })
        res.status(200).send({ response: "changed" })
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
  const {problemId, reply, name} = req.body
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

export async function addUsername(req: Request, res: Response, next: NextFunction) {
  const {problemId, username, where} = req.body
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
    if (isJWTPayload(auth, username)) {
      try {
        await ProblemInformation.updateOne({
          problemId: problemId
        }, {
          $addToSet: {[where]: username}
        })
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function deleteUsername(req: Request, res: Response, next: NextFunction) {
  const {problemId, username, where} = req.body
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
    if (isJWTPayload(auth, username)) {
      try {
        await ProblemInformation.updateOne({
          problemId: problemId
        }, {
          $pull: {[where]: username}
        })
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function addCorrectUser(req: Request, res: Response, next: NextFunction) {
  const {problemId, name, level} = req.body
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
          $addToSet: {correctUser: name},
          $inc: {totalCorrectUserLevel: level, correct: 1}
        })
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function addWrong(req: Request, res: Response, next: NextFunction) {
  const {problemId, name, level} = req.body
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
          $inc: {totalWrongUserLevel: level, wrong: 1}
        })
      } catch (error) {
        next(error)
      }
    }
  })

}