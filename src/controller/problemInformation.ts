import { NextFunction, Request, Response } from "express";
import { ProblemInformation } from "../models/problemInformation";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload, ownParse } from "../util/helpers";

export async function changeCount(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, where, name, count} = req.body
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
    const update = await ProblemInformation.updateOne({
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

export async function getRecommendedProblem(req: Request, res: Response, next: NextFunction) {
  const problemList = await ProblemInformation.aggregate([
    { $addFields: { arrayLength: { $size: "$liked" } } }, // 해당 어레이의 길이를 추가 필드로 생성
    { $sort: { arrayLength: -1 } }, // 어레이의 길이를 기준으로 내림차순 정렬
    { $limit: 4 },
    { $project: { problemId: 1, _id: 0 } }
  ])
  res.status(200).json(problemList)
}

export async function deleteReply(req: Request, res: Response, next: NextFunction) {
  try {
    await ProblemInformation.updateMany({}, {
      $unset: {reply: ""}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}


export async function addUsername(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, username, where} = req.body
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
    if (!isJWTPayload(auth, username)) {
      return res.sendStatus(403);
    }
    await ProblemInformation.updateOne({
      problemIndex: problemIdx
    }, {
      $addToSet: {[where]: username}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function deleteUsername(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, username, where} = req.body
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
    if (!isJWTPayload(auth, username)) {
      return res.sendStatus(403);
    }
    await ProblemInformation.updateOne({
      problemIndex: problemIdx
    }, {
      $pull: {[where]: username}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function addCorrectUser(req: Request, res: Response, next: NextFunction) {
  const {problemId, name, level} = req.body
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
    await ProblemInformation.updateOne({
      problemId: problemId
    }, {
      $addToSet: {correctUser: name},
      $inc: {totalCorrectUserLevel: level, correct: 1}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function addWrong(req: Request, res: Response, next: NextFunction) {
  const {problemId, name, level} = req.body
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
    await ProblemInformation.updateOne({
      problemId: problemId
    }, {
      $inc: {totalWrongUserLevel: level, wrong: 1}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function getProblemByIndexList(req: Request, res: Response, next: NextFunction) {
  const problemIndexdList = req.params.problemIndexList
  const indexList = JSON.parse(problemIndexdList)
  try {
    const problemList = await ProblemInformation.find({problemIndex: {$in: indexList}})
                                      .sort({ time: 1 })
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getProblemByFilter(req: Request, res: Response, next: NextFunction) {
  const filter: string = req.params.filter
  const info = ownParse(filter)
  try {
    const problemList = await ProblemInformation.find({level: {$gt: info.low, $lt: info.high}, creator: info.creator? info.creator : {$type: "string"}})
                                                .sort({ time: 1 })
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}
