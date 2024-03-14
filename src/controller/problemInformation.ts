import { NextFunction, Request, Response } from "express";
import { ProblemInformation } from "../models/problemInformation";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { isJWTPayload } from "../util/helpers";

export async function changeCount(req: Request, res: Response, next: NextFunction) {
  const {problemId, where, name, count} = req.body
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
      problemId: problemId
    }, {
      $inc: {[where]: count}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}



export async function getProblemInformations(req: Request, res: Response, next: NextFunction) {
  const problemId = req.params.problemId
  try {
    const info = await ProblemInformation.findOne({problemId: problemId})
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

export async function addReply(req: Request, res: Response, next: NextFunction) {
  const {problemId, reply, name} = req.body
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
      $push: {reply: reply}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function getReply(req: Request, res: Response, next: NextFunction) {
  const problemId = req.params.problemId
  try {
    const problem = await ProblemInformation.findOne({problemId: problemId})
    res.status(200).json(problem?.reply)
  } catch (error) {
    next(error)
  }
}

export async function addUsername(req: Request, res: Response, next: NextFunction) {
  const {problemId, username, where} = req.body
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
      problemId: problemId
    }, {
      $addToSet: {[where]: username}
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function deleteUsername(req: Request, res: Response, next: NextFunction) {
  const {problemId, username, where} = req.body
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
      problemId: problemId
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

export async function getAllProblems(req: Request, res: Response, next: NextFunction) {
  // Problem db에 저장된 모든 문제의 정보를 반환
  try {
    const allProblems = await ProblemInformation.find().sort({ time: 1 })
    res.status(200).json(allProblems)
  } catch (error) {
    next(error)
  }
}

export async function getProblemsByCreator(req: Request, res: Response, next: NextFunction) {
  const creator = req.params.creator
  try {
    const problems = await ProblemInformation.find({ creator: creator })
                                  .sort({ time: 1 })
    res.status(200).json(problems)
  } catch (error) {
    next(error)
  }
}

export async function getProblemsByLevel(req: Request, res: Response, next: NextFunction) {
  const level = req.params.level
  try {
    const problems = await ProblemInformation.find({ level: level })
                                  .sort({ time: 1 })
    res.status(200).json(problems)
  } catch (error) {
    next(error)
  }
}

export async function getProblemByIdList(req: Request, res: Response, next: NextFunction) {
  const problemIdList = req.params.problemIdList
  const idList = JSON.parse(problemIdList)
  try {
    const problemList = await ProblemInformation.find({problemId: {$in: idList}})
                                      .sort({ time: 1 })
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getProblemByFilter(req: Request, res: Response, next: NextFunction) {
  const info = JSON.parse(req.params.info)
  try {
    const problemList = await ProblemInformation.find({level: {$gt: info.low, $lt: info.high}, creator: info.creator? info.creator : {$type: "string"}})
                                                .sort({ time: 1 })
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}
