import { NextFunction, Request, Response } from "express";
import { UserDetail } from "../models/userDetail";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload } from "../util/helpers";


// 4 functions below are violating "Don't Repeat Yourself (DRY)"
export async function addElement(req: Request, res: Response, next: NextFunction) {
  const problemId = req.body.problemId
  const name = req.body.name
  const where = req.body.where
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
        switch (where) {
          case "tried":
            await UserDetail.updateOne({
              name: name
            }, {
              $addToSet: {tried: problemId}
            })
            break
          case "solved":
            await UserDetail.updateOne({
              name: name
            }, {
              $addToSet: {solved: problemId}
            })
            break
          case "liked":
            await UserDetail.updateOne({
              name: name
            }, {
              $addToSet: {liked: problemId}
            })
            break
          case "disliked":
            await UserDetail.updateOne({
              name: name
            }, {
              $addToSet: {disliked: problemId}
            })
            break
          case "asked":
            await UserDetail.updateOne({
              name: name
            }, {
              $addToSet: {asked: problemId}
            })
            break
          default:
            break
        }
        res.status(200).send({respones: "added"})
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function deleteElement(req: Request, res: Response, next: NextFunction) {
  const problemId = req.body.problemId
  const name = req.body.name
  const where = req.body.where
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
        switch (where) {
          case "tried":
            await UserDetail.updateOne({
              name: name
            }, {
              $pull: {tried: problemId}
            })
            break
          case "solved":
            await UserDetail.updateOne({
              name: name
            }, {
              $pull: {solved: problemId}
            })
            break
          case "liked":
            await UserDetail.updateOne({
              name: name
            }, {
              $pull: {liked: problemId}
            })
            break
          case "disliked":
            await UserDetail.updateOne({
              name: name
            }, {
              $pull: {disliked: problemId}
            })
            break
          case "asked":
            await UserDetail.updateOne({
              name: name
            }, {
              $addToSet: {asked: problemId}
            })
            break
          default:
            break
        }
        res.status(200).send({respones: "added"})
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function getUserDetail(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const detail = await UserDetail.findOne({ name: name })
    res.status(200).json(detail)
  } catch (error) {
    next(error)
  }
}


export async function getAllCreators(req: Request, res: Response, next: NextFunction) {
  try {
    const allCreators = await UserDetail.find({ created: {$ne: []}}, {name: 1})
    res.status(200).json(allCreators)
  } catch (error) {
    next(error)
  }
}

export async function changePoint(req: Request, res: Response, next: NextFunction) {
  const name: string = req.body.name
  const operator: string = req.body.operator
  const point: number = req.body.point
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
        switch(operator) {
          case "add":
            await UserDetail.updateOne({
              name: name
            }, {
              $inc: {point: point}
            })
          case "sub":
            await UserDetail.updateOne({
              name: name
            }, {
              $inc: {point: -point}
            })
        }
      } catch (error) {
        next(error)
      }
    }
  })
}