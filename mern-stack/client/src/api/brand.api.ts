import { TQueryParams, TResponseNoPagination } from "@/types/common.type";

import { TBrand } from "@/types/brand.type";
import http from "@/configs/instance.config";

export const brandApi = {
  getAllBrands: async (params: TQueryParams) => {
    const response = await http.get<TResponseNoPagination<TBrand>>(`/brand`, {
      params,
    });
    return response.data;
  },
};
