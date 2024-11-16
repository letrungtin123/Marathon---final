import http from "@/configs/instance.config";
import { TCreateOrder } from "@/types/order.type";

export const orderApi = {
  // create order
  createOrder: async (body: TCreateOrder) => {
    const response = await http.post<{ message: string; success: boolean }>(
      `/order`,
      body
    );
    return response.data;
  },
  //get order by user id
  getOrderByUserId: async (userId: string) => {
    const response = await http.get<{ message: string; success: boolean }>(
      `/order/${userId}`
    );
    return response.data;
  },
};

//   // get orders by user id
//   getOrdersByUserId: async (userId: string) => {
//     const response = await http.get(`/order/${userId}`);
//     console.log("🚀 ~ getOrdersByUserId: ~ response.data:", response.data);
//     return response.data;
//   },
