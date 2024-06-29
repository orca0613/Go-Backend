import { Request, Response,  NextFunction} from "express";
import { User } from "../models/user";
import { comparePassword, hashPassword, isValidMember, sendResetPasswordMail, sendVerifyMail } from "../util/helpers";
import { isValidObjectId } from "mongoose";
import { UserDetail } from "../models/userDetail"
import jwt from 'jsonwebtoken';
import { env } from "process";
import { RefreshToken } from "../models/refreshToken";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  const { email, password, language, level } = req.body
  const hashed = await hashPassword(password)
  try {
    const newUser = await User.create({
      ...req.body,
      password: hashed,
      language: language,
      time: new Date(),
    })
    await UserDetail.create({
      name: newUser.name,
      level: level,
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
    const user = await UserDetail.findOne({ name: name })
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
  const {name, email, password} = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      return res.sendStatus(404)
    } 
    if (user.name !== name) {
      return res.sendStatus(403)
    }
    const match = await comparePassword(password, user.password)
    if (match) {
      await User.findByIdAndDelete(user._id)
      return res.sendStatus(204)
    } else {
      res.sendStatus(400)
    }
  } catch (error) {
    next(error)
  }
}

export async function verifyMail(req: Request, res: Response, next: NextFunction) {
  const userId = req.params.userId
  try {
    const user = await User.findById(userId)
    if (user) {
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
        $currentDate: {loginTime: 1},
        $set: {verify: true}
      })
      res.status(200).json(response)
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

export async function reissueAccessToken(req: Request, res: Response, next: NextFunction) {
  const { refreshToken } = req.body
  const secretKey = env.TOKEN_KEY?? ""
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, secretKey)
      const username = payload.sub
      const storedToken = await RefreshToken.findOne({name: username})
      if (storedToken && storedToken.token === refreshToken) {
        const newAccessToken = jwt.sign({
          name: username
        }, secretKey, {expiresIn: "1d"})
        return res.json({ accessToken: newAccessToken })
      } else {
        return res.status(403).json({ error: 'Invalid refresh token' })
      }
    } catch (error) {
      next(error)
    }
  }
  return res.status(400).json({ error: 'Refresh token missing' })
}



// app.post('/api/refresh', async (req: Request, res: Response) => {
//   const { refreshToken } = req.body;
//   if (refreshToken) {
//     try {
//       const payload: any = jwt.verify(refreshToken, SECRET_KEY);
//       const userId = payload.sub;
//       const storedToken = await RefreshToken.findOne({ userId });
//       if (storedToken && storedToken.token === refreshToken) {
//         const newAccessToken = createAccessToken(userId);
//         return res.json({ accessToken: newAccessToken });
//       } else {
//         return res.status(403).json({ error: 'Invalid refresh token' });
//       }
//     } catch (error) {
//       return res.status(403).json({ error: 'Invalid refresh token' });
//     }
//   }
//   return res.status(400).json({ error: 'Refresh token missing' });
// });
