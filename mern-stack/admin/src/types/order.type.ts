export type TInforOrderShipping = {
  name: string
  email: string
  phone: string
  address: string
}

// export type TProductId = {
//   _id: string
//   nameProduct: string
//   images: string
// }
export type TProductsInOrder = {
  color: string
  price: number
  productId: {
    _id: string
    desc: string
    nameProduct: string
    images: string
  }
  quantity: number
  size: string
}
export type TOrder = {
  _id: string
  userId: string
  status: 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'
  note: string
  paymentMethod: 'cod' | 'payment'
  total: number
  products: TProductsInOrder[]
  priceShipping: number
  infoOrderShipping: TInforOrderShipping
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
