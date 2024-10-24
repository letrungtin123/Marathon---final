export const generateQueryString = (name: string, id: string) => {
	const slug = name.toLocaleUpperCase().replace(/ /g, '-');
	return `${slug}-ii_-${id}`;
};

export const getProductIdFromQueryString = (queryString: string) => {
	return queryString.split('-ii_-')[1];
};
