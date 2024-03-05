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
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: '이메일 인증',
    text: `이메일을 인증하려면 클릭하세요: <a href="https://go-problem-test.web.app/verify/${userId}"></a>`
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
  })
}