import http from "@/configs/instance.config";
import {
  TBodyRegister,
  TBodyResetPassword,
  TResponseRegister,
} from "@/types/auth.type";

const authApi = {
  login: async (body: { email: string; password: string }) => {
    return await http
      .post(`/login`, body)
      .then((response) => {
        const { data } = response;

        // Kiểm tra trạng thái người dùng trong phản hồi
        if (data.user?.status === "inactive") {
          return Promise.reject("Tài khoản đã bị vô hiệu hóa.");
        }

        return data; // Nếu tài khoản hợp lệ, trả về dữ liệu đăng nhập
      })
      .catch((error) => {
        // Nếu có lỗi (bao gồm tài khoản bị vô hiệu hóa), ném lỗi
        return Promise.reject(error); // Lỗi sẽ được xử lý ở nơi gọi API
      });
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
