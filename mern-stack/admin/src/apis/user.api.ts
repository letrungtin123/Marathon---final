import { TQueryParams, TResponse } from '@/types/common.type'
import { TUser } from '@/types/user.type'
import api from './base-url.api'

const USER_URL = `/users`

//get list users
export const getUsers = async (token: string, params?: TQueryParams): Promise<TResponse<TUser>> => {
  const response = await api.get<TResponse<TUser>>(`${USER_URL}`, {
    params: {
      ...params
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

//update status user
export const updateUser = async (body: TUser, token: string) => {
  const response = await api.patch(`/user/${body._id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
