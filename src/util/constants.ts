import nodemailer from 'nodemailer';
import 'dotenv/config'
export const USER = "user"
export const PROBLEM = "problem"
export const PROBLEM_INFORMATION = "problem_information"
export const USER_DETAIL = "user_detail"
export const REPLY = "reply"
export const MESSAGE = "message"
export const REQUESTS = "requests"
export const HARDEST_SAMPLE_PROBLEM = "hardest_sample_problem"
export const HARD_SAMPLE_PROBLEM = "hard_sample_problem"
export const MIDDLE_SAMPLE_PROBLEM = "middle_sample_problem"
export const EASY_SAMPLE_PROBLEM = "easy_sample_problem"
export const EASIEST_SAMPLE_PROBLEM = "easiest_sample_problem"
export const SAMPLE_PROBLEM = "sample_problem"
export const REFRESH_TOKEN = "refresh_token"
export const CREATOR = "creator"
export const TOKEN_EXPIRY = "1d"
export const HOME = "https://go-problem-test.web.app/"

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

export const PasswordChangeGreeting = [
  "Hello, please click the link to change your password",
  "안녕하세요, 비밀번호를 변경하려면 링크를 클릭하세요",
  "您好，请点击链接修改密码",
  "こんにちは、リンクをクリックしてパスワードを変更してください"
]
export const goToChange = [
  "Go to change", "변경하러 가기", "去改变", "変更に行く"
]

export const verificationNotice = [
  "Hello, please click the link to complete email verification",
  "안녕하세요, 이메일 인증을 완료하려면 링크를 클릭하세요",
  "您好，请点击链接完成邮箱验证",
  "こんにちは。リンクをクリックしてメール認証を完了してください"
]

export const goToVerification = [
  "Go to verification", "인증하러 가기", "前往验证", "認証に行く"
]

export const changePasswordLink = [
  "Change password link", "비밀번호 변경 링크", "更改密码链接", "パスワード変更リンク"
]

export const emailVerificationLink = [
  "E-mail verification link", "이메일 인증 링크", "电子邮件验证链接", "メール認証リンク"
]
