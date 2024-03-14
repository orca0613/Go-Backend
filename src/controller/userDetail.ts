import { NextFunction, Request, Response } from "express";
import { UserDetail } from "../models/userDetail";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload } from "../util/helpers";


export async function addElement(req: Request, res: Response, next: NextFunction) {
  const {element, name, where} = req.body
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
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function deleteElement(req: Request, res: Response, next: NextFunction) {
  const {element, name, where} = req.body
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
    await UserDetail.updateOne({
      name: name
    }, {
      $pull: {[where]: element}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function getUserDetail(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const detail = await UserDetail.findOne({ name: name })
    if (detail) {
      return res.status(200).json(detail)
    }
    res.sendStatus(404)
  } catch (error) {
    next(error)
  }
}


export async function getAllCreators(req: Request, res: Response, next: NextFunction) {
  try {
    const allCreators = await UserDetail.find({ created: {$ne: []}}, {name: 1})
    if (allCreators) {
      return res.status(200).json(allCreators)
    }
    res.sendStatus(404)
  } catch (error) {
    next(error)
  }
}

export async function changeInfoAndPoint(req: Request, res: Response, next: NextFunction) {
  const {name, point, problemId, where} = req.body
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
    await UserDetail.updateOne({
      name: name
    }, {
      $inc: {point: point},
      $addToSet:{[where]: problemId}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
