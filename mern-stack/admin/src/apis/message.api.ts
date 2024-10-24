import { BodySendMessage, Message } from '@/types/message.type'

import { TResponse } from '@/types/common.type'
import api from './base-url.api'

export const getAllMessagers = async (roomId: string, token: string): Promise<TResponse<Message>> => {
  const response = await api.get(`/messagers/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const createMessage = async (body: BodySendMessage, token: string) => {
  const response = await api.post(`/messagers`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}
