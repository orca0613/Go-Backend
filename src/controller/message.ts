import { NextFunction, Request, Response } from "express";
import { isValidMember } from "../util/helpers";
import { Message } from "../models/message";
import { User } from "../models/user";

export async function sendMessage(req: Request, res: Response, next: NextFunction) {
  const {sender, receiver, title, contents, quotation} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, sender)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    const newMessage = await Message.create({
      sender: sender,
      receiver: receiver,
      title: title,
      contents: contents,
      quotation: quotation,
      time: new Date(),
    })
    res.status(201).json(newMessage)
  } catch (error) {
    next(error)
  }
}

export async function checkMessage(req: Request, res: Response, next: NextFunction) {
  const {id, name} = req.body
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, name)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    await Message.findOneAndUpdate({_id: id, receiver: name}, {
      checked: true
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

export async function getMessageBySender(req: Request, res: Response, next: NextFunction) {
  const sender = req.params.sender
  try {
    const messageList = await Message.find({sender: sender, hideToSender: false}).sort({time: -1})
    res.status(200).json(messageList)
  } catch (error) {
    next(error)
  }
}

export async function getMessageByReceiver(req: Request, res: Response, next: NextFunction) {
  const receiver = req.params.receiver
  try {
    const messageList = await Message.find({receiver: receiver, hideToReceiver: false}).sort({time: -1})
    res.status(200).json(messageList)
  } catch (error) {
    next(error)
  }
}

export async function getMessageById(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id
  try {
    const messageList = await Message.findById(id)
    res.status(200).json(messageList)
  } catch (error) {
    next(error)
  }
}

export async function getNumberUncheckedMessages(req: Request, res: Response, next: NextFunction) {
  const name = req.params.name
  try {
    const unchecked = await Message.countDocuments({receiver: name, checked: false, hideToReceiver: false})
    res.status(200).json(unchecked)
  } catch (error) {
    next(error)
  }
}

export async function hideMessage(req: Request, res: Response, next: NextFunction) {
  const { idList, name, where } = req.body
  const splited: string[] = idList.split("&")
  const bearerHeader = req.headers["authorization"]
  if (!bearerHeader) {
    return res.sendStatus(401)
  }
  const memberStatus = await isValidMember(bearerHeader, name)
  if (memberStatus !== 200) {
    return res.sendStatus(memberStatus)
  }
  try {
    splited.map(async id => {
      await Message.findByIdAndUpdate(id, {
        [where]: true
      })
    })
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}

// export async function sendSuggestMessage(req: Request, res: Response, next: NextFunction) {
//   const allUsers = await User.find()
//   try {
//     allUsers.map(async user => {
//       const form: string[] = suggestTesterForm(user.language)
//       await Message.create({
//         sender: "admin",
//         receiver: user.name,
//         title: form[0],
//         contents: form[1],
//         time: new Date()
//       })
//     })
//     res.sendStatus(201)
//   } catch (error) {
//     next(error)
//   }
// }


