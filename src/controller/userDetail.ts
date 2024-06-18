import { NextFunction, Request, Response } from "express";
import { UserDetail } from "../models/userDetail";
import { isValidMember } from "../util/helpers";
import { User } from "../models/user";
import _ from "lodash";

export async function addElement(req: Request, res: Response, next: NextFunction) {
  const {element, name, where} = req.body
  const bonus = where === "solved"? 100 : 0
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, name)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await UserDetail.updateOne({
      name: name
    }, {
      $addToSet: {[where]: element},
      $inc: {point: bonus}
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

export async function changeSetting(req: Request, res: Response, next: NextFunction) {
  const {name, language, level, auto} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, name)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Promise.all([
      UserDetail.findOneAndUpdate({name: name}, {
        $set: {auto: auto, level: level}
      }),
      User.findOneAndUpdate({name: name}, {
        $set: {level: level, language: language}
      })
    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
