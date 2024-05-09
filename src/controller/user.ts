import { Request, Response,  NextFunction} from "express";
import { User } from "../models/user";
import { comparePassword, hashPassword, isJWTPayload, sendResetPasswordMail, sendVerifyMail } from "../util/helpers";
import { isValidObjectId } from "mongoose";
import { UserDetail } from "../models/userDetail"
import jwt from 'jsonwebtoken';
import { env } from "process";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { email, password, language, level } = req.body
  const hashed = await hashPassword(password)
  try {
    const newUser = await User.create({
      ...req.body,
      password: hashed,
      verify: false,
      language: language,
      time: new Date(),
    })
    const newUserDetail = await UserDetail.create({
      name: newUser.name,
      point: 10000,
      auto: false,
      level: level,
      totalLike: 0,
    });
    sendVerifyMail(email, newUser._id, language)
    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
}

export async function checkDuplicateEmail(req: Request, res: Response, next: NextFunction) {
  const email = req.params.email
  try {
    const user = await User.findOne({ email: email })
    res.status(200).json(user? true : false)
  } catch (error) {
    next(error)
  }
}

export async function checkDuplicateName(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const user = await User.findOne({ name: name })
    res.status(200).json(user? true : false)
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const {email, password} = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.sendStatus(404)
    } else if (!user.verify) {
      sendVerifyMail(email, user._id, user.language)
      return res.sendStatus(403)
    } else {
      const match = await comparePassword(password, user.password)
      if (match) {
        const token = jwt.sign({
          id: user._id,
          name: user.name
        }, env.TOKEN_KEY?? "", {expiresIn: "1d"})
        const response = {
          name: user.name,
          level: user.level,
          token: token,
          language: user.language
        }
        await User.updateOne({
          name: user.name
        }, {
          $currentDate: {loginTime: 1}
        })
        res.status(200).json(response)
      } else {
        res.sendStatus(400)
      }
    }
  } catch (error) {
    next(error)
  }
}

export async function deleteId(req: Request, res: Response, next: NextFunction) {
  const {id, name} = req.body
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
    if (!isValidObjectId(id)) {
      return res.sendStatus(400)
    }
    const result = await User.findByIdAndDelete(id)
    if (!result) {
      return res.sendStatus(404)
    } else {
      res.sendStatus(200)
    }
  } catch (error) {
    next(error)
  }
}

export async function verifyMail(req: Request, res: Response, next: NextFunction) {
  const userId = req.params.userId
  try {
    const update = await User.findByIdAndUpdate(userId, {
      $set: {verify: true}
    })
    if (update) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction) {
  const {id, password} = req.body
  const hashed = await hashPassword(password)
  try {
    const update = await User.findByIdAndUpdate(id, {
      $set: {password: hashed}
    })
    if (update) {
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (error) {
    next(error)
  }
}

export async function checkPasswordAndReturnId(req: Request, res: Response, next: NextFunction) {
  const info = req.params.info
  const [name, password] = info.split(" ")
  try {
    const user = await User.findOne({name: name})
    if (!user) {
      return res.sendStatus(404)
    }
    const match = await comparePassword(password, user.password)
    if (!match) {
      return res.sendStatus(401)
    }
    res.status(200).json({
      id: user._id
    })

  } catch (error) {
    next(error)
  }
}

export async function checkEmailAndSendUrl(req: Request, res: Response, next: NextFunction) {
  const email = req.params.email
  try {
    const user = await User.findOne({email: email})
    if (!user) {
      return res.sendStatus(404)
    }
    sendResetPasswordMail(email, user._id, user.language)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}
