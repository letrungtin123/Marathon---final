export type TInforOrderShipping = {
  name: string
  email: string
  phone: string
  address: string
}

export type TOrder = {
  _id: string
  userId: string
  status: 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'
  note: string
  paymentMethod: 'cod' | 'payment'
  total: number
  products: string[]
  inforOrderShipping: TInforOrderShipping
  assignee: TAssignee
  reasonCancel: string
  createdAt: string
  updatedAt: string
}

export type TOrderForm = {
  userId: string
  status: 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'
  note: string
  paymentMethod: 'cod' | 'payment'
  total: number
  products: string[]
  inforOrderShipping: TInforOrderShipping
  assignee: string
  reasonCancel: string
}

export type TAssignee = {
  _id: string
  fullname: string
  role: 'admin' | 'staff'
}

export type TOrderFormEdit = {
  _id: string
  status: 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'
}
