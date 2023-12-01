import { Request, Response,  NextFunction} from "express";
import { User } from "../models/user";
import { comparePassword, hashPassword } from "../util/helpers";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const password = req.body.password
  const hashed = await hashPassword(password)
  try {
    const newUser = await User.create({
      ...req.body,
      password: hashed
    })
    res.status(200).json(newUser)
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
  const email = req.body.email
  const password = req.body.password
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      res.status(400).send("not exist email")
    } else {
      const match = await comparePassword(password, user.password)
      if (match) {
        res.status(200).json(user)
      } else {
        res.status(400).send("wrong password")
      }
    }
  } catch (error) {
    next(error)
  }
}