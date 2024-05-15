import { NextFunction, Request, Response } from "express";
import { ProblemInformation } from "../models/problemInformation";
import jwt from 'jsonwebtoken';
import { env } from "process";
import { getRangeByLevel, getTierByLevel, isJWTPayload, ownParse, sampleDbBox } from "../util/helpers";
import { UserDetail } from "../models/userDetail";

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
  const name = req.params.name
  try {
    const user = await UserDetail.findOne({name: name})
    const [low, high] = getRangeByLevel(user?.level || 19)
    const problemList = await ProblemInformation.find({problemIndex: {$nin: user?.solved}, level: {$lt: high, $gt: low}}).sort({liked: -1}).limit(4)
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getRepresentativeProblem(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const problemList = await ProblemInformation.find({creator: name}).sort({liked: -1}).limit(4)
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getSolvedProblem(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const user = await UserDetail.findOne({name: name})
    const problemList = await ProblemInformation.find({problemIndex: {$in: user?.solved}}).sort({level: 1}).limit(4)
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
}

export async function getNewestProblem(req: Request, res: Response, next: NextFunction) {
  try {
    const problemList = await ProblemInformation.find().sort({time: -1}).limit(4)
    res.status(200).json(problemList)
  } catch (error) {
    next(error)
  }
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

export async function handleLiked(req: Request, res: Response, next: NextFunction) {
  const {problemIdx, username, creator, level, add} = req.body
  const tier = getTierByLevel(level)
  const cnt = add? 1 : -1
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
    await Promise.all([
      ProblemInformation.updateOne({
        problemIndex: problemIdx
      }, {
        $inc: {liked: cnt}
      }),
      UserDetail.updateOne({
        name: creator
      }, {
        $inc: {totalLike: cnt}
      }),
      sampleDbBox[tier - 1].updateOne({
        problemIndex: problemIdx
      }, {
        $inc: {liked: cnt}
      })

    ])
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}


