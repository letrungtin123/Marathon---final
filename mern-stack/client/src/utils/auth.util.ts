export const setAccessTokenToLS = (accessToken: string) => {
	localStorage.setItem('accessToken', accessToken);
};

export const getAccessTokenFromLS = () => {
	return localStorage.getItem('accessToken') ?? '';
};

export const removeAccessTokenFromLS = () => {
	localStorage.removeItem('accessToken');
};
