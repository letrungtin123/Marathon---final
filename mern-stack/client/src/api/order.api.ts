
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
};
