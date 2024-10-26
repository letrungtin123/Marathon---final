import http from "@/configs/instance.config";
import { TAddToCart, TListCart } from "@/types/cart.type";
import { TResponseDetail } from "@/types/common.type";

export const cartApi = {
  //add to cart
  addToCart: async (body: TAddToCart) => {
    const response = await http.post<{ message: string; success: boolean }>(
      `/cart`,
      body
    );
    return response.data;
  },

  getAllCarts: async () => {
    const response = await http.get<TResponseDetail<TListCart>>(`cart`);
    return response.data;
  },
};
