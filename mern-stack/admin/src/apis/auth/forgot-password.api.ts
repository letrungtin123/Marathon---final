import api from '../base-url.api'

export const forgotPasswordApi = {
  sendResetPasswordEmail: async (email: string) => {
    const response = await api.post(`/send-email`, { email })
    return response.data
  },
  resetPassword: async (token: string, bodyResetPassword: { newPassword: string; confirmPassword: string }) => {
    const response = await api.put(`/reset-password?type=reset`, bodyResetPassword, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
}
