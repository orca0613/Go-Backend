import { NextFunction, Request, Response } from "express";
import { getTierByLevel, isValidMember, ownParse } from "../util/helpers";
import { SampleProblem } from "../models/sampleProblem";
import { UserDetail } from "../models/userDetail";

export async function getRecommendedProblem(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const user = await UserDetail.findOne({name: name})
    const tier = getTierByLevel(user?.level || 19)
    const problemList = await SampleProblem.find({problemIndex: {$nin: user?.solved}, tier: tier}).sort({liked: -1}).limit(4)
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getNewestProblem(req: Request, res: Response, next: NextFunction) {
  try {
    const problemList = await SampleProblem.find().sort({problemIndex: -1}).limit(4)
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getRepresentativeProblem(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const problemList = await SampleProblem.find({creator: name}).sort({liked: -1}).limit(4)
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getSolvedProblem(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const user = await UserDetail.findOne({name: name})
    const problemList = await SampleProblem.find({problemIndex: {$in: user?.solved}}).sort({level: 1}).limit(4)
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
  const tierFilter = Number(info.tier) > 0? {tier: info.tier} : {}
  try {
    const problemList = await SampleProblem.find({...tierFilter, ...creatorFilter, ...levelFilter}).sort({problemIndex: -1})
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
} 

export async function getSampleProblemsByIndexList(req: Request, res: Response, next: NextFunction) {
  const problemIndexdList = req.params.problemIndexList
  const indexList = JSON.parse(problemIndexdList)

  try {
    const problemList = await SampleProblem.find({problemIndex: {$in: indexList}}).sort({problemIndex: -1})
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getSampleProblemByIdx(req: Request, res: Response, next: NextFunction) {
  const problemIndex = req.params.problemIndex
  try {
    const problem = await SampleProblem.findOne({problemIndex: problemIndex})
    if (!problem) {
      return res.sendStatus(404)
    }
    res.status(200).json(problem.liked)
  } catch (error) {
    next(error)
  }
}

export async function handleLiked(req: Request, res: Response, next: NextFunction) {
  const {problemIndex, name, creator, add} = req.body
  const cnt = add? 1 : -1
  const request = add? {
    $addToSet: {liked: problemIndex}
  } : {
    $pull: {liked: problemIndex}
  }
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
      SampleProblem.updateOne({
        problemIndex: problemIndex
      }, {
        $inc: {liked: cnt}
      }),
      UserDetail.updateOne({
        name: creator
      }, {
        $inc: {totalLike: cnt}
      }),
      UserDetail.updateOne({
        name: name
      }, request)
    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
