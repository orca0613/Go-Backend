import { NextFunction, Request, Response } from "express";
import { UserDetail } from "../models/userDetail";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload } from "../util/helpers";


export async function addElement(req: Request, res: Response, next: NextFunction) {
  const element = req.body.element
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
        await UserDetail.updateOne({
          name: name
        }, {
          $addToSet: {[where]: element}
        })
        if (where === "followList") {
          await UserDetail.updateOne({
            name: element
          }, {
            $addToSet: {myFollowers: name}
          })
        }
        res.status(200).send({respones: "added"})
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function deleteElement(req: Request, res: Response, next: NextFunction) {
  const element = req.body.element
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
        await UserDetail.updateOne({
          name: name
        }, {
          $pull: {[where]: element}
        })
        res.status(200).send({respones: "deleted"})
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
        await UserDetail.updateOne({
          name: name
        }, {
          $inc: {point: point}
        })
        res.status(200).json({ response: "updated" })
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function resetField(req: Request, res: Response, next: NextFunction) {
  try {
    await UserDetail.updateMany({}, {
      $set: {
        solved: [],
      }
    })
  } catch (error) {
    next(error)
  }
}