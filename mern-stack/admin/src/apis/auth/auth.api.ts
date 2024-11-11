import { TBodyLogin, TResponseLogin } from '@/types/auth/auth.type'

import api from '../base-url.api'

export const login = async (body: TBodyLogin): Promise<TResponseLogin> => {
  const response = await api.post('/login', body)
  const { data } = response
  // Kiểm tra trạng thái người dùng trong phản hồi
  if (data.user?.status === 'inactive') {
    return Promise.reject(new Error('Tài khoản đã bị vô hiệu hóa.'))
  }
  return response.data
}
