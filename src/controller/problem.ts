import { NextFunction, Request, Response } from "express";
import { Problem } from "../models/problem";
import { ProblemInformation } from "../models/problemInformation";
import { UserDetail } from "../models/userDetail";
import jwt from 'jsonwebtoken';
import { env } from 'process';
import _ from "lodash";
import { initialVariations } from "../util/constants";
import { getTierByLevel, isJWTPayload, sampleDbBox } from "../util/helpers";

export async function createProblem(req: Request, res: Response, next: NextFunction) {
  const { initialState, creator, level } = req.body;
  const tier = getTierByLevel(level)
  const bearerHeader = req.headers["authorization"];
  const secretKey = process.env.TOKEN_KEY || "";
  if (!bearerHeader) {
    return res.sendStatus(401);
  }
  const token = bearerHeader.split(" ")[1];
  try {
    const auth = await new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return res.sendStatus(401);
        } 
        resolve(decoded);
      });
    });
    if (!isJWTPayload(auth, creator)) {
      return res.sendStatus(403);
    }
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
        initialState,
        level: level,
        creator: creator,
        view: 0,
        correctUser: [],
        correct: 0,
        totalCorrectUserLevel: 0,
        totalWrongUserLevel: 0,
        wrong: 0,
        time: new Date(),
        problemIndex: newIdx,
        liked: 0
      }),
      UserDetail.updateOne(
        { name: creator },
        { $addToSet: { created: newIdx, tried: newIdx } }
      ),
      sampleDbBox[tier - 1].create({
        problemIndex: newIdx,
        initialState: initialState,
        level: level,
        creator: creator,
        time: new Date(),
        liked: 0
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
    if (!isJWTPayload(auth, creator)) {
      return res.sendStatus(403);
    }
    await Promise.all([
      Problem.findOneAndDelete({problemIdx: problemIdx}),
      ProblemInformation.findOneAndDelete({problemIndex: problemIdx}),
      sampleDbBox[tier - 1].findOneAndDelete({problemIndex: problemIdx}),
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
    const update = await Problem.updateOne({
      problemIdx: problemIdx
    }, {
      $set: {[where]: variations}
    }, {
      new: true
    })
    if (where === "questions") {
      if (_.isEqual(variations, initialVariations)) {
        await UserDetail.updateOne({
          name: creator
        }, {
          $pull: {withQuestions: problemIdx}
        })
      } else {
        await UserDetail.updateOne({
          name: creator
        }, {
          $addToSet: {withQuestions: problemIdx}
        })
      }
    }
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function modifyProblem(req: Request, res: Response, next: NextFunction) {
  const {creator, problemIdx, initialState, comment, level, color} = req.body
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
          return res.sendStatus(401)
        };
        resolve(decoded);
      });
    });
    if (!isJWTPayload(auth, creator)) {
      return res.sendStatus(403);
    }
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
      })
    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}