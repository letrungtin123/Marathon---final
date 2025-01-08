// export type TInforOrderShipping = {
//   name: string
//   email: string
//   phone: string
//   address: string
// }

import { TProduct } from './product.type'

// // export type TProductId = {
// //   _id: string
// //   nameProduct: string
// //   images: string
// // }
// export type TProductsInOrder = {
//   color: string
//   price: number
//   productId: {
//     _id: string
//     desc: string
//     nameProduct: string
//     images: string
//   }
//   quantity: number
//   size: string
// }
// export type TOrder = {
//   _id: string
//   userId: string
//   status: 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'
//   note: string
//   paymentMethod: 'cod' | 'payment'
//   total: number
//   products: TProductsInOrder[]
//   priceShipping: number
//   infoOrderShipping: TInforOrderShipping
//   assignee: TAssignee
//   reasonCancel: string
//   createdAt: string
//   updatedAt: string
// }

// export type TOrderForm = {
//   userId: string
//   status: 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'
//   note: string
//   paymentMethod: 'cod' | 'payment'
//   total: number
//   products: string[]
//   inforOrderShipping: TInforOrderShipping
//   assignee: string
//   reasonCancel: string
// }

// export type TAssignee = {
//   _id: string
//   fullname: string
//   role: 'admin' | 'staff'
// }

// export type TOrderFormEdit = {
//   _id: string
//   status: 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'
// }

export type TInfoOrderShipping = {
  name: string
  phone: string
  address: string
  email: string
}

export type TOrderStatus = 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'

export type TOrderProduct = {
  productId: Pick<TProduct, '_id' | 'nameProduct' | 'desc' | 'images'>
  quantity: number
  size: string
  color: string
  price: number
  _id: string
}

export type TOrderInfo = TInfoOrderShipping & { _id: string }

export type TOrder = {
  _id: string
  userId: {
    _id: string
    email: string
  }
  status: TOrderStatus
  note: string
  paymentMethod: string
  total: number
  products: TOrderProduct[]
  infoOrderShipping: TOrderInfo
  priceShipping: number
  reasonCancel: string
  createdAt: string
  updatedAt: string
}

export type TCancelOrder = {
  status: 'cancelled'
  message: string
}
