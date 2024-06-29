import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import 'dotenv/config'
import { PasswordChangeGreeting, changePasswordLink, emailVerificationLink, goToChange, goToVerification, transporter, verificationNotice } from './constants';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';


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

export function getRequestCheckNoticeForm(creator: string, problemIdx: string, language: number): string[] {
  let form = ""
  let greeting = ""
  switch (language) {
    case 0:
      form = `${creator} has confirmed the request you left. Even if the creator confirmed it, there is a possibility that the variations may not have been updated.&${problemIdx}`
      greeting = `${creator} has confirmed the request you left.`
      break
    case 1:
      form = `회원님이 남겨주신 요청을 ${creator}님이 확인 했습니다. 출제자가 확인 했더라도 변화도는 업데이트 되지 않았을 수 있습니다.&${problemIdx}`
      greeting = `회원님이 남겨주신 요청을 ${creator}님이 확인 했습니다.`
      break
    case 2:
      form = `${creator}已经确认了你留下的请求。即使创建者确认了这一点，也有可能还没有更新变化。&${problemIdx}`
      greeting = `${creator}已经确认了你留下的请求`
      break
    case 3:
      form = `会員様が残してくださった要請を${creator}様が確認しました。創作者が確認しても変化度が更新されていない可能性があります。&${problemIdx}`
      greeting = `会員様が残してくださった要請を${creator}様が確認しました。`
      break
    default:
      break
  }
  return [greeting, form]
}

export function getTierByLevel(level: number): number {
  if (level < -4) {
    return 1
  } else if (level < 0) {
    return 2
  } else if (level < 7) {
    return 3
  } else if (level < 13) {
    return 4
  } else if (level < 19) {
    return 5
  } else {
    return 0
  }
}

export async function isValidMember(bearerHeader: string, name: string): Promise<number> {
  const secretKey = process.env.TOKEN_KEY || "";
  const token = bearerHeader.split(" ")[1];
  const auth = await new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return 401;
      } 
      resolve(decoded);
    });
  });
  if (!isJWTPayload(auth, name)) {
    return 403;
  }
  return 200
}

// export function suggestTesterForm(languageIdx: number) {
//   let title = ""
//   let content = ""
//   switch (languageIdx) {
//     case 0:
//       title = "We are recruiting beta testers for the official app release!"
//       content =  "We are looking for people to download the test version of the app first and participate in beta testing. Eligible participants must be Android device users. If you are interested, please reply with your email address. Recruitment will end once the minimum number of testers is reached. We look forward to your involvement!"
//       break
//     case 1:
//       title = "정식 앱 출시를 위한 베타 테스터를 모집합니다!"
//       content = `테스트 버전의 앱을 먼저 다운로드하고 베타 테스트에 참여해 주실 분들을 찾고 있습니다. 참여 자격은 안드로이드 디바이스 이용자입니다. 관심 있는 분들은 답장으로 이메일 주소를 보내 주시기 바랍니다. 필요한 테스트 인원이 충족되면 모집을 종료할 예정입니다. 많은 참여 부탁드립니다!`
//       break
//     case 2:
//       title = "我们正在招募正式版应用程序发布的 Beta 测试人员！"
//       content = "我们正在寻找愿意首先下载测试版应用程序并参与 Beta 测试的 Android 设备用户。如果您有兴趣，请回复您的电子邮件地址。当达到所需的最低测试人数时，我们将结束招募。期待您的参与！"
//       break
//     case 3:
//       title = "正式アプリをリリースするためのベータテスターを募集します！"
//       content = "テスト版のアプリをダウンロードし、ベータテストに参加してくださる方を探しています。参加資格はAndroidデバイスユーザーです。興味のある方は、返信でメールアドレスをお送りください。必要なテスター数に達した時点で、募集を終了します。 たくさんのご参加をお待ちしています！"
//       break
//     default:
//       break
//   }
//   return [title, content]
// }

