import http from "@/configs/instance.config";
import {
  TBodyRegister,
  TBodyResetPassword,
  TResponseRegister,
} from "@/types/auth.type";

const authApi = {
  login: async (body: { email: string; password: string }) => {
    const response = await http.post(`/login`, body);
    return response.data;
  },
  register: async (body: TBodyRegister): Promise<TResponseRegister> => {
    const response = await http.post("/register", body);
    return response.data;
  },
  resetPassword: async (
    token: string,
    body: TBodyResetPassword
  ): Promise<TBodyResetPassword> => {
    const response = await http.put<TBodyResetPassword>(
      `/reset-password`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

export default authApi;
