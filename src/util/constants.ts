import nodemailer from 'nodemailer';
import 'dotenv/config'

export const USER = "user"
export const PROBLEM = "problem"
export const PROBLEM_INFORMATION = "problem_information"
export const USER_DETAIL = "user_detail"
export const CREATOR = "creator"
export const TOKEN_EXPIRY = "1d"

export const initialVariations: object = {
  "0": []
}

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
})
