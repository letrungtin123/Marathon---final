import { TQueryParams, TResponseNoPagination } from '@/types/common.type'

import api from './base-url.api'
import { TVoucher } from '@/types/voucher.type'

export const voucherApi = {
  getVouchers: async (params: TQueryParams) => {
    const response = await api.get<TResponseNoPagination<TVoucher>>('/vouchers', {
      params
    })
    return response.data
  }
}
