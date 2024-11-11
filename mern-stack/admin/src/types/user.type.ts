export type TUser = {
  _id: string
  email: string
  role: 'admin' | 'customer' | 'staff'
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  address: string
  fullname: string
  phone: number
  avatar: string
}

export interface TProfile {
  _id?: string
  fullname: string
  email: string
  phone: string | number
  address: string
  updatedAt?: Date
  status?: string
  avatar?: string
}
export type TFormUser = Pick<TUser, 'status'>
