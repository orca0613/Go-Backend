import { Request, Response,  NextFunction} from "express";
import { User } from "../models/user";
import { comparePassword, hashPassword, isJWTPayload } from "../util/helpers";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";
import { UserDetail } from "../models/userDetail"
import jwt from 'jsonwebtoken';
import { env } from "process";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const password = req.body.password
  const hashed = await hashPassword(password)
  try {
    const newUser = await User.create({
      ...req.body,
      password: hashed,
      time: new Date(),
    })
    const newUserDetail = await UserDetail.create({
      name: newUser.name,
      point: 1000,
    });
    res.status(200).send({response: "Sign up completed"})
  } catch (error) {
    next(error)
  }
}

export async function checkDuplicateEmail(req: Request, res: Response, next: NextFunction) {
  const email = req.params.email
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      res.status(200).json({ duplicate: false })
    } else if (user) {
      res.status(400).json({ duplicate: true })
    }
  } catch (error) {
    next(error)
  }
}

export async function checkDuplicateName(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const user = await User.findOne({ name: name })
    if (!user) {
      res.status(200).json({ duplicate: false })
    } else if (user) {
      res.status(400).json({ duplicate: true })
    }
  } catch (error) {
    next(error)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const {email, password} = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      res.status(400).send({response: "Not exist email"})
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
        }
        await UserDetail.updateOne({
          name: user.name
        }, {
          $currentDate: {loginTime: 1}
        })
        res.status(200).json(response)
      } else {
        res.status(400).send({response: "Wrong password"})
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
    res.sendStatus(403)
  }
  const token = bearerHeader?.split(" ")[1]
  jwt.verify(token?? "", secretKey, async (err, auth) => {
    if (err) {
      res.sendStatus(403)
    }
    if (isJWTPayload(auth, name)) {
      try {
        if (!isValidObjectId(id)) {
          throw createHttpError(404, "Incorrect user ID provided")
        }
        const problem = await User.findByIdAndDelete(id)
        if (!problem) {
          throw createHttpError(400, "User not found")
        } else {
          res.status(200).send(`Deleted ${id}`)
        }
      } catch (error) {
        next(error)
      }
    }
  })
}