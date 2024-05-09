import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import 'dotenv/config'
import { PasswordChangeGreeting, changePasswordLink, emailVerificationLink, goToChange, goToVerification, transporter, verificationNotice } from './constants';
import { Types } from 'mongoose';


export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// Function to generate a random secret key
export function generateRandomSecretKey(length: number): string {
  const bytes = randomBytes(length);
  return bytes.toString('hex');
};

export function isJWTPayload(auth: any, name: string) {
  if (!auth || typeof auth === "string") {
    return false
  }
  return auth.name === name
}

export function sendVerifyMail(email: string, userId: Types.ObjectId, languageIdx: number) {
  const emailBody = `
  <p>${verificationNotice[languageIdx]}</p>
  <a href="https://go-problem-test.web.app/verify/${userId}">${goToVerification[languageIdx]}</a>`
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: emailVerificationLink[languageIdx],
    html: emailBody
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
  })
}

export function sendResetPasswordMail(email: string, userId: Types.ObjectId, languageIdx: number) {
  const emailBody = `
  <p>${PasswordChangeGreeting[languageIdx]}</p>
  <a href="https://go-problem-test.web.app/change-password/${userId}">${goToChange[languageIdx]}</a>`
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: changePasswordLink[languageIdx],
    html: emailBody
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
  })
}

export function ownParse(param: string) {
  interface myObject {
    [key: string]: number | string
  }

  const filter: myObject = {}
  const parts = param.split("&")
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) {
      continue
    }
    const [key, value] = part.split("=")
    filter[key] = value
  }

  return filter
}

export function getRequestCheckNoticeForm(creator: string, url: string, language: number): string[] {
  let form = ""
  let greeting = ""
  switch (language) {
    case 0:
      form = `${creator} has confirmed the request you left. Even if the creator confirmed it, there is a possibility that the variations may not have been updated.&${url}`
      greeting = `${creator} has confirmed the request you left.`
      break
    case 1:
      form = `회원님이 남겨주신 요청을 ${creator}님이 확인 했습니다. 출제자가 확인 했더라도 변화도는 업데이트 되지 않았을 수 있습니다.&${url}`
      greeting = `회원님이 남겨주신 요청을 ${creator}님이 확인 했습니다.`
      break
    case 2:
      form = `${creator}已经确认了你留下的请求。即使创建者确认了这一点，也有可能还没有更新变化。&${url}`
      greeting = `${creator}已经确认了你留下的请求`
      break
    case 3:
      form = `会員様が残してくださった要請を${creator}様が確認しました。創作者が確認しても変化度が更新されていない可能性があります。&${url}`
      greeting = `会員様が残してくださった要請を${creator}様が確認しました。`
      break
    default:
      break
  }
  return [greeting, form]
}


export function getRangeByLevel(level: number): number[] {
  if (level < -4) {
    return [-10, -4]
  } else if (level < 0) {
    return [-5, 0]
  } else if (level < 7) {
    return [0, 7]
  } else if (level < 13) {
    return [6, 13]
  } else if (level < 19) {
    return [12, 19]
  } else {
    return [-10, 19]
  }
}
