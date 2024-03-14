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
  const { initialState, creator, level } = req.body;
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
    const newProblem = await Problem.create({
      ...req.body,
      time: new Date(),
    });
    const problemId = String(newProblem._id);
    await Promise.all([
      ProblemInformation.create({
        problemId,
        initialState,
        level: level,
        creator: creator,
        view: 0,
        liked: [],
        disliked: [],
        correctUser: [],
        correct: 0,
        totalCorrectUserLevel: 0,
        totalWrongUserLevel: 0,
        wrong: 0,
        reply: [],
        time: new Date(),
      }),
      UserDetail.updateOne(
        { name: creator },
        { $addToSet: { created: problemId, tried: problemId } }
      ),
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
  const {problemId, creator} = req.body
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
      Problem.findByIdAndDelete(problemId),
      ProblemInformation.findOneAndDelete({problemId: problemId}),
      UserDetail.updateOne({
        name: creator
      }, {
        $pull: {created: problemId, withQuestions: problemId}
      })
    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function getProblemById(req: Request, res: Response, next: NextFunction) {
  const problemId = req.params.problemId
  try {
    const problem = await Problem.findById(problemId)
    res.status(200).json(problem)
  } catch (error) {
    next(error)
  }
}

export async function updateVariations(req: Request, res: Response, next: NextFunction) {
  const {problemId, where, variations, name, creator} = req.body
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
      _id: problemId
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
          $pull: {withQuestions: problemId}
        })
      } else {
        await UserDetail.updateOne({
          name: creator
        }, {
          $addToSet: {withQuestions: problemId}
        })
      }
    }
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function modifyProblem(req: Request, res: Response, next: NextFunction) {
  const {creator, problemId, initialState, comment, level, color} = req.body
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
      }),
      ProblemInformation.findOneAndUpdate({
        problemId: problemId
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