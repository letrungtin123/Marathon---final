import http from "@/configs/instance.config";
import { TBodyRegister, TResponseRegister } from "@/types/auth.type";

const authApi = {
  login: async (body: { email: string; password: string }) => {
    const response = await http.post(`/login`, body);
    return response.data;
  },
  register: async (body: TBodyRegister): Promise<TResponseRegister> => {
    const response = await http.post("/register", body);
    return response.data;
  },
};

export default authApi;
