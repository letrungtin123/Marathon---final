import { TBodyLogin, TResponseLogin } from '@/types/auth/auth.type'

import api from '../base-url.api'

export const login = async (body: TBodyLogin): Promise<TResponseLogin> => {
  const response = await api.post('/login', body)
  return response.data
}
