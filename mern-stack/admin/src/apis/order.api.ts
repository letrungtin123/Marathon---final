// apis/order.api.ts
import { TQueryParams, TResponse } from '@/types/common.type'
import { TCancelOrder, TOrder, TOrderStatus } from '@/types/order.type'
import api from './base-url.api'

export const orderApi = {
  // Lấy danh sách đơn có phân trang
  getAllOrders: async (params: TQueryParams = {}, token: string) => {
    const { page, limit, _page, _limit, ...rest } = params || {}

    // Số trang & page size chuẩn
    const pageNum = page ?? _page ?? 1
    const limitNum = limit ?? _limit ?? 10

    // GỬI CẢ 2 BỘ THAM SỐ để backend nào cũng hiểu
    const normalizedParams = {
      ...rest,
      page: pageNum,
      limit: limitNum,
      _page: pageNum,
      _limit: limitNum,
      sort: rest?.sort ?? '-createdAt'
    }

    const response = await api.get<TResponse<TOrder>>(`/orders`, {
      params: normalizedParams,
      headers: { Authorization: `Bearer ${token}` }
    })

    // Ép kiểu số để an toàn
    const data = response.data
    data.totalDocs = Number(data.totalDocs ?? 0)
    data.limit = Number(data.limit ?? limitNum)
    data.page = Number(data.page ?? pageNum)
    return data
  },

  updateOrderStatus: async (idOrder: string, body: { status: TOrderStatus }, token: string) => {
    const response = await api.patch<{ message: string; success: boolean }>(`/order/${idOrder}`, body, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  cancelOrder: async (orderId: string, body: TCancelOrder) => {
    const response = await api.patch<{ message: string; success: boolean }>(`/order/cancel/${orderId}`, body)
    return response.data
  }
}
