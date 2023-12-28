import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';


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