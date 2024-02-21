import { NextFunction, Request, Response } from "express";
import { Problem } from "../models/problem";
import { ProblemInformation } from "../models/problemInformation";
import { UserDetail } from "../models/userDetail";
import jwt from 'jsonwebtoken';
import { env } from 'process';
import _ from "lodash";
import { initialVariations } from "../util/constants";
import { isJWTPayload } from "../util/helpers";

export async function createProblem(req: Request, res: Response, next: NextFunction) {
  // Problem db에 새로운 문제를 생성한 뒤 새로 만들어진 아아디를 problemId로 갖는 
  // ProblemInformation db에 새로운 document를 생성한 뒤
  // UserDetail db에서 creator의 created 목록을 갱신
  const creator: string = req.body.creator
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
    if (isJWTPayload(auth, creator)) {
      try {
        const newProblem = await Problem.create({
          ...req.body,
          time: new Date(),
        });
        const problemId = newProblem._id
        await ProblemInformation.create({
          problemId: problemId,
          view: 0,
          liked: [],
          disliked: [],
          correctUser: [],
          correct: 0,
          totalCorrectUserLevel: 0,
          totalWrongUserLevel: 0,
          wrong: 0,
          reply: [],

        })
        await UserDetail.updateOne({
          name: creator
        }, {
          $addToSet: {created: problemId}
        })
      res.status(200).send({
        response: "created",
        id: problemId,
      });
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function deleteProblem(req: Request, res: Response, next: NextFunction) {
  // Problem db에서 문제를 삭제하는 함수. 
  // 문제를 만들 때와 마찬가지로 ProblemInformation db와
  // UserDetail db에 대한 정보도 업데이트
  const {problemId, creator} = req.body
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
    if (isJWTPayload(auth, creator)) {
      try {
        await Problem.findByIdAndDelete(problemId)
        await ProblemInformation.findOneAndDelete({problemId: problemId})
        await UserDetail.updateOne({
          name: creator
        }, {
          $pull: {created: problemId}
        })
        res.status(200).send({response: "Deleted"})
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function getAllProblems(req: Request, res: Response, next: NextFunction) {
  // Problem db에 저장된 모든 문제의 정보를 반환
  try {
    const allProblems = await Problem.find().sort({ time: -1 })
    res.status(200).json(allProblems)
  } catch (error) {
    next(error)
  }
}

export async function getProblemsByCreator(req: Request, res: Response, next: NextFunction) {
  const creator = req.params.creator
  try {
    const problems = await Problem.find({ creator: creator })
                                  .sort({ time: -1 })
    res.status(200).json(problems)
  } catch (error) {
    next(error)
  }
}

export async function getProblemsByLevel(req: Request, res: Response, next: NextFunction) {
  const level = req.params.level
  try {
    const problems = await Problem.find({ level: level })
                                  .sort({ time: -1 })
    res.status(200).json(problems)
  } catch (error) {
    next(error)
  }
}

export async function getProblemByIdList(req: Request, res: Response, next: NextFunction) {
  const problemIdList = req.params.problemIdList
  const idList = problemIdList.split("&")
  try {
    const problemList = await Problem.find({ _id: {$in: idList}})
                                      .sort({ time: -1 })
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getProblemById(req: Request, res: Response, next: NextFunction) {
  const problemId = req.params.problemId
  try {
    const problem = await Problem.findOne({ _id: problemId})
    res.status(200).json(problem)
  } catch (error) {
    next(error)
  }
}

export async function updateVariations(req: Request, res: Response, next: NextFunction) {
  const {problemId, variations, answers, questions, name, creator} = req.body
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
        await Problem.updateOne({
          _id: problemId
        }, {
          $set: {variations: variations, answers: answers, questions: questions}
        }, {
          new: true
        })
        if (_.isEqual(questions, initialVariations)) {
          await UserDetail.updateOne({
            name: creator
          }, {
            $pull: {withQuestions: problemId}
          })
        } else {
          await UserDetail.updateOne({
            name: creator
          }, {
            $addToSet: {withQuestions: problemId}
          })
        }
      } catch (error) {
        next(error)
      }
    }
  })
}

export async function modifyProblem(req: Request, res: Response, next: NextFunction) {
  const {creator, problemId, initialState, comment, level, color} = req.body
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
    if (isJWTPayload(auth, creator)) {
      try {
        const update = await Problem.findOneAndUpdate({
          _id: problemId
        }, {
          $set: {
            initialState: initialState,
            comment: comment,
            level: level,
            color: color,
          }
        }, {
          new: true
        })
        if (update) {
          res.status(200).send({response: "Success"})
        } else {
          res.status(400).send({response: "Not found"})
        }
      } catch (error) {
        next(error)
      }
    }
  })
}