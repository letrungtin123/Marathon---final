export type TCreateOrder = {
	userId: string;
	status: "pending";
	note: string;
	paymentMethod: string;
	total: number;
	products: TProductRefCreateOrder[];
	infoOrderShipping: TInfoOrderShipping;
	priceShipping: number;
	voucher: string;
};

export type TProductRefCreateOrder = {
	productId: string;
	quantity: number;
	size: string;
	color: string;
	price: number;
};

export type TInfoOrderShipping = {
	name: string;
	phone: string;
	address: string;
	email: string;
};