import http from "@/configs/instance.config";
import { TResponseNoPagination } from "@/types/common.type";
import { TCancelOrder, TCreateOrder, TOrder } from "@/types/order.type";

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
  getOrder: async () => {
    const response = await http.get<TResponseNoPagination<TOrder>>(`/order`);
    return response.data;
  },

  //cancel order
  cancelOrder: async (orderId: string, body: TCancelOrder) => {
    const response = await http.patch<{ message: string; success: boolean }>(
      `/order/cancel/${orderId}`,
      body
    );
    return response.data;
  },
};
