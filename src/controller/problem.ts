import { NextFunction, Request, Response } from "express";
import { Problem } from "../models/problem";
import { ProblemInformation } from "../models/problemInformation";
import { UserDetail } from "../models/userDetail";
import _ from "lodash";
import { getTierByLevel, isValidMember } from "../util/helpers";
import { SampleProblem } from "../models/sampleProblem";
import { initialVariations } from "../util/constants";

export async function createProblem(req: Request, res: Response, next: NextFunction) {
  const { initialState, creator, level } = req.body;
  const tier = getTierByLevel(level)
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
    return res.sendStatus(401);
  }
  const memberStatus = await isValidMember(bearerHeader, creator)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    const lastProblem = await Problem.find().sort({problemIdx: -1}).limit(1)
    const newIdx = lastProblem[0].problemIdx + 1
    const newProblem = await Problem.create({
      ...req.body,
      time: new Date(),
      problemIdx: newIdx
    });
    const problemId = String(newProblem._id);
    await Promise.all([
      ProblemInformation.create({
        problemId,
        level: level,
        creator: creator,
        time: new Date(),
        problemIndex: newIdx,
      }),
      UserDetail.updateOne(
        { name: creator },
        { $addToSet: { created: newIdx, tried: newIdx } }
      ),
      SampleProblem.create({
        problemIndex: newIdx,
        initialState: initialState,
        level: level,
        creator: creator,
        tier: tier,
      })
    ]);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

export async function deleteProblem(req: Request, res: Response, next: NextFunction) {
  // Problem db에서 문제를 삭제하는 함수. 
  // 문제를 만들 때와 마찬가지로 ProblemInformation db와
  // UserDetail db에 대한 정보도 업데이트
  const {problemIdx, creator, level} = req.body
  const tier = getTierByLevel(level)
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, creator)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Promise.all([
      Problem.findOneAndDelete({problemIdx: problemIdx}),
      ProblemInformation.findOneAndDelete({problemIndex: problemIdx}),
      SampleProblem.findOneAndDelete({problemIndex: problemIdx}),
      UserDetail.updateOne({
        name: creator
      }, {
        $pull: {created: problemIdx, withQuestions: problemIdx}
      })
    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function getProblemByIdx(req: Request, res: Response, next: NextFunction) {
  const problemIdx = Number(req.params.problemIdx)
  try {
    const problem = await Problem.findOne({problemIdx: problemIdx})
    if (!problem) {
      return res.sendStatus(404)
    }
    res.status(200).json(problem)
  } catch (error) {
    next(error)
  }
}

export async function updateVariations(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, where, variations, name, creator} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, name)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Problem.updateOne({
      problemIdx: problemIdx
    }, {
      $set: {[where]: variations}
    }, {
      new: true
    })
    if (where === "questions") {
      const request = _.isEqual(variations, initialVariations)? {
        $pull: {withQuestions: problemIdx}
      } : {
        $addToSet: {withQuestions: problemIdx}
      }
      await UserDetail.updateOne({name: creator}, request)
    }
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function modifyProblem(req: Request, res: Response, next: NextFunction) {
  const {creator, problemIdx, initialState, comment, level, color} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, creator)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Promise.all([
      Problem.findOneAndUpdate({
        problemIdx: problemIdx
      }, {
        $set: {
          initialState: initialState,
          comment: comment,
          level: level,
          color: color,
        }
      }, {
        new: true
      }),
      ProblemInformation.findOneAndUpdate({
        problemIndex: problemIdx
      }, {
        $set: {
          initialState: initialState,
          level: level
        }
      }),
      SampleProblem.findOneAndUpdate({
        problemIndex: problemIdx
      }, {
        $set: {
          initialState: initialState,
          level: level
        }
      })
    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}