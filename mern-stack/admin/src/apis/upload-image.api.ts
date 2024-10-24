import api from './base-url.api'

export const uploadImage = (data: FormData, token: string) => {
  return api.post('/image/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data', // bắt buộc phải có
      Authorization: `Bearer ${token}`
    }
  })
}
