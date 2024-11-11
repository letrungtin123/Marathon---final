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

export type TFormUser = Pick<TUser, 'status'>
