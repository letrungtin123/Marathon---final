import { TQueryParams, TResponse, TResponseDetail } from "@/types/common.type";

import { TProduct } from "@/types/product.type";
import http from "@/configs/instance.config";

export const productApi = {
  getProducts: async (params?: TQueryParams): Promise<TResponse<TProduct>> => {
    const response = await http.get<TResponse<TProduct>>(`/products`, {
      params,
    });
    return response.data;
  },

  // get detail product
  getProductById: async (id: string) => {
    const response = await http.get<TResponseDetail<TProduct>>(
      `/product/${id}`
    );
    return response.data;
  },
};
