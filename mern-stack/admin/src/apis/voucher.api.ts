import { TQueryParams, TResponseDetail, TResponseNoPagination } from '@/types/common.type'

import api from './base-url.api'
import { TFormVoucher, TVoucher } from '@/types/voucher.type'
const VOUCHER_URL = '/voucher'
const VOUCHERS_URL = '/vouchers'
export const getVoucher = async (token: string, params?: TQueryParams): Promise<TResponseNoPagination<TVoucher>> => {
  const response = await api.get<TResponseNoPagination<TVoucher>>(`${VOUCHERS_URL}`, {
    params: {
      ...params
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}
export const createVoucher = async (body: TFormVoucher, token: string): Promise<TResponseDetail<TVoucher>> => {
  const response = await api.post<TResponseDetail<TVoucher>>(`${VOUCHER_URL}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export const updateVoucher = async (body: TVoucher, token: string) => {
  const response = await api.patch(`${VOUCHER_URL}/${body._id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
