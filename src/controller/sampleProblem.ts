import { NextFunction, Request, Response } from "express";
import { HardSampleProblem } from "../models/hardSampleProblem";
import { ProblemInformation } from "../models/problemInformation";
import { EasiestSampleProblem } from "../models/easiestSampleProblem";
import { HardestSampleProblem } from "../models/hardestSampleProblem";
import { MiddleSampleProblem } from "../models/middleSampleProblem";
import { EasySampleProblem } from "../models/easySampleProblem";
import { getTierByLevel, mergeArrays, ownParse, sampleDbBox } from "../util/helpers";




export async function getSampleProblemsByLevel(req: Request, res: Response, next: NextFunction) {
  const level = req.params.level
  

  try {
    const problemList = await HardSampleProblem.find({level: Number(level)}).sort({time: -1})
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getSampleProblemsByFilter(req: Request, res: Response, next: NextFunction) {
  const filter: string = req.params.filter
  const info = ownParse(filter)
  const creatorFilter = info.creator? {creator: info.creator} : {}
  const levelFilter = Number(info.level)? {level: Number(info.level)} : {}
  const tier = Number(info.tier)
  if (!tier) {
    try {
      const hardest = await HardestSampleProblem.find({...creatorFilter, ...levelFilter})
      const hard = await HardSampleProblem.find({...creatorFilter, ...levelFilter})
      const middle = await MiddleSampleProblem.find({...creatorFilter, ...levelFilter})
      const easy = await EasySampleProblem.find({...creatorFilter, ...levelFilter})
      const easiest = await EasiestSampleProblem.find({...creatorFilter, ...levelFilter})
      const problemList = mergeArrays(hardest, hard, middle, easy, easiest).sort((a, b) => b.problemIndex - a.problemIndex)
      res.status(200).json(problemList)
    } catch (error) {
      next(error)
    }
  } else {
    try {
      const problemList = await sampleDbBox[tier - 1].find({...creatorFilter, ...levelFilter}).sort({time: -1})
      res.status(200).json(problemList)
    } catch (error) {
      next(error)
    }

  }
}

export async function getSampleProblemsByIndexList(req: Request, res: Response, next: NextFunction) {
  const problemIndexdList = req.params.problemIndexList
  const indexList = JSON.parse(problemIndexdList)

  try {
    const hardest = await HardestSampleProblem.find({problemIndex: {$in: indexList}})
    const hard = await HardSampleProblem.find({problemIndex: {$in: indexList}})
    const middle = await MiddleSampleProblem.find({problemIndex: {$in: indexList}})
    const easy = await EasySampleProblem.find({problemIndex: {$in: indexList}})
    const easiest = await EasiestSampleProblem.find({problemIndex: {$in: indexList}})
    const problemList = mergeArrays(hardest, hard, middle, easy, easiest).sort((a, b) => b.problemIndex - a.problemIndex)
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getSampleProblemsByTier(req: Request, res: Response, next: NextFunction) {
  const tier = Number(req.params.tier)

  try {
    const problemList = await sampleDbBox[tier - 1].find()
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}