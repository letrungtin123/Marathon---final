import http from '@/configs/instance.config';

const authApi = {
	login: async (body: { email: string; password: string }) => {
		const response = await http.post(`/login`, body);
		return response.data;
	},
};

export default authApi;
