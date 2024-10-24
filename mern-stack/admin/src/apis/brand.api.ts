import { TQueryParams, TResponseDetail, TResponseNoPagination } from '@/types/common.type'
import api from './base-url.api'
import { TBrand, TFormBrand } from '@/types/brand.type'

const BRAND_URL = `/brand`
const BRANDS_URL = `/brand`

export const getBrands = async (token: string, params?: TQueryParams): Promise<TResponseNoPagination<TBrand>> => {
  const response = await api.get<TResponseNoPagination<TBrand>>(`${BRANDS_URL}`, {
    params: {
      ...params
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export const createBrand = async (body: TFormBrand, token: string): Promise<TResponseDetail<TBrand>> => {
  const response = await api.post<TResponseDetail<TBrand>>(`${BRAND_URL}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const updateBrand = async (body: TBrand, token: string) => {
  const response = await api.patch(`${BRAND_URL}/${body._id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
console.log('🚀 ~ updateBrand ~ response.data:', updateBrand)

// delete
export const deleteBrand = async (id: string, token: string) => {
  const response = await api.delete(`${BRAND_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
