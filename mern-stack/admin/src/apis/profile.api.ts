import api from './base-url.api'

export const getMeInfo = async (token: string) => {
  const response = await api.get(`/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
