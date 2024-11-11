import { JwtPayload } from 'jwt-decode'

export type TBodyLogin = {
  email: string
  password: string
}

export type TResponseLogin = {
  message: string
  success: boolean
  accessToken: string
  user?: {
    status: string
  }
}
export type TBodyResetPassword = {
  newPassword: string
  confirmPassword: string
}

export interface PayloadLogin extends JwtPayload {
  _id: string
  email: string
  role: string
  iat: number
  exp: number
}
