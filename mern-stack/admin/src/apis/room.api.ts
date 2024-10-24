import { Room } from '@/types/room.type'
import { TResponse } from '@/types/common.type'
import api from './base-url.api'

export const getAllRooms = async (token: string): Promise<TResponse<Room>> => {
  const response = await api.get(`/rooms`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
