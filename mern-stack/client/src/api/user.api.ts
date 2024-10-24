import { TResponseDetail } from '@/types/common.type';
import { TUser } from '@/types/user.type';
import http from '@/configs/instance.config';

export const userApi = {
	getProfile: async (): Promise<TResponseDetail<TUser>> => {
		const response = await http.get(`/me`);
		return response.data;
	},
};
