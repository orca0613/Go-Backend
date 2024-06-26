import { NextFunction, Request, Response } from "express";
import { ProblemInformation } from "../models/problemInformation";
import { isValidMember } from "../util/helpers";
import { UserDetail } from "../models/userDetail";


export async function changeCount(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, where, name, count} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, name)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await ProblemInformation.updateOne({
      problemIndex: problemIdx
    }, {
      $inc: {[where]: count}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}



export async function getProblemInformations(req: Request, res: Response, next: NextFunction) {
  const problemIdx = Number(req.params.problemIdx)
  try {
    const info = await ProblemInformation.findOne({problemIndex: problemIdx})
    if (!info) {
      return res.sendStatus(404)
    }
    res.status(200).json(info)
  } catch (error) {
    next(error)
  }
}

export async function addCorrectUser(req: Request, res: Response, next: NextFunction) {
  const {problemIndex, name, level, problemLevel} = req.body
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
      ProblemInformation.updateOne({
        problemIndex: problemIndex
      }, {
        $addToSet: {correctUser: name},
        $inc: {totalCorrectUserLevel: level, correct: 1}
      }),
      UserDetail.updateOne({
        name: name
      }, {
        $addToSet: {solved: problemIndex},
        $inc: {point: 100, totalCorrect: 1, [`correctPerLevel.${problemLevel}`]: 1}
      })
    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function addWrong(req: Request, res: Response, next: NextFunction) {
  const {problemIndex, name, level, problemLevel} = req.body
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
      UserDetail.updateOne({
        name: name
      }, {
        $inc: {[`wrong.${problemIndex}`]: 1, [`wrongPerLevel.${problemLevel}`]: 1, totalWrong: 1}
      }),
      ProblemInformation.updateOne({
        problemIndex: problemIndex
      }, {
        $inc: {totalWrongUserLevel: level, wrong: 1}
      })
    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}



