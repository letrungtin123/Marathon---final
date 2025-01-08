// import { TQueryParams, TResponse } from '@/types/common.type'
// import api from './base-url.api'

import { TQueryParams, TResponse } from '@/types/common.type'
import { TCancelOrder, TOrder, TOrderStatus } from '@/types/order.type'
import api from './base-url.api'

// import { TOrder, TOrderForm, TOrderFormEdit } from '@/types/order.type'

// export const getOrders = async (token: string, params?: TQueryParams): Promise<TResponse<TOrder>> => {
//   const response = await api.get<TResponse<TOrder>>(`/orders`, {
//     params,
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   return response.data
// }

// export const addOrder = async (data: TOrderForm, token: string) => {
//   const response = await api.post<TResponse<TOrder>>('/order', data, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   return response.data
// }

// export const editOrder = async (data: TOrderFormEdit, token: string) => {
//   const response = await api.patch(`/order/${data._id}`, data, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   return response.data
// }

// export const getOrder = async (token: string, id: string) => {
//   const response = await api.get(`/order/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   })
//   return response.data
// }

export const orderApi = {
  //get orders
  getAllOrders: async (params: TQueryParams, token: string) => {
    const response = await api.get<TResponse<TOrder>>(`/orders`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  //update status order
  updateOrderStatus: async (idOrder: string, body: { status: TOrderStatus }, token: string) => {
    const response = await api.patch<{ message: string; success: boolean }>(`/order/${idOrder}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  //cancel order
  cancelOrder: async (orderId: string, body: TCancelOrder) => {
    const response = await api.patch<{ message: string; success: boolean }>(`/order/cancel/${orderId}`, body)
    return response.data
  }
}
