import http from "@/configs/instance.config";
import { TQueryParams, TResponseNoPagination } from "@/types/common.type";
import { TVoucher } from "@/types/voucher.type";

export const voucherApi = {
	getVouchers: async (params: TQueryParams) => {
		const response = await http.get<TResponseNoPagination<TVoucher>>(
			"/vouchers",
			{ params }
		);
		return response.data;
	},
};