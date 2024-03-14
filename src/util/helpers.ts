import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import 'dotenv/config'
import { transporter } from './constants';
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

export function sendVerifyMail(email: string, userId: Types.ObjectId) {
  const emailBody = `
  <p>안녕하세요, 인증 링크를 클릭하여 계정을 활성화하세요:</p>
  <a href="https://go-problem-test.web.app/verify/${userId}">인증하기</a>`
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: '이메일 인증',
    html: emailBody
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
  })
}