import { TCategory, TFormCategory } from '@/types/category.type'
import { TQueryParams, TResponseDetail, TResponseNoPagination } from '@/types/common.type'

import api from './base-url.api'

const CATEGORY_URL = `/category`
const CATEGORIES_URL = `/categories`

export const getCategories = async (
  token: string,
  params?: TQueryParams
): Promise<TResponseNoPagination<TCategory>> => {
  const response = await api.get<TResponseNoPagination<TCategory>>(`${CATEGORIES_URL}`, {
    params: {
      ...params
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export const createCategory = async (body: TFormCategory, token: string): Promise<TResponseDetail<TCategory>> => {
  const response = await api.post<TResponseDetail<TCategory>>(`${CATEGORY_URL}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const updateCategory = async (body: TCategory, token: string) => {
  const response = await api.patch(`${CATEGORY_URL}/${body._id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

// delete category
export const deleteCategory = async (id: string, token: string) => {
  const response = await api.delete(`${CATEGORY_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
