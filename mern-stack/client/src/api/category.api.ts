import { TQueryParams, TResponseNoPagination } from "@/types/common.type";

import { TCategory } from "@/types/category.type";
import http from "@/configs/instance.config";

const CATEGORIES_URL = `/categories`;
export const categoryApi = {
  // get all category
  getAllCategories: async (params?: TQueryParams) => {
    const response = await http.get<TResponseNoPagination<TCategory>>(
      `${CATEGORIES_URL}`,
      { params }
    );
    return response.data;
  },
};
