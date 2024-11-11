import { TQueryParams, TResponse, TResponseDetail } from '@/types/common.type'
import { TProfile, TUser } from '@/types/user.type'
import api from './base-url.api'
import { TBodyResetPassword } from '@/types/auth/auth.type'

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

export const userApi = {
  getProfile: async (): Promise<TResponseDetail<TUser>> => {
    const response = await api.get(`/me`)
    return response.data
  },
  getProfileDetail: async (token: string): Promise<TResponseDetail<TProfile>> => {
    const response = await api.get(`/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  updateProfile: async (body: TProfile, token: string) => {
    const response = await api.patch(`/me`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },
  resetPassword: async (token: string, body: TBodyResetPassword): Promise<TBodyResetPassword> => {
    const response = await api.put<TBodyResetPassword>(`/reset-password`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
}
