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

export interface TOrderProduct {
	productId: {
	  _id: string;
	  nameProduct: string;
	  desc: string;
	  brand: string;
	  category: string;
	  images: Array<{
		url: string;
		public_id: string;
		_id: string;
	  }>;
	};
	quantity: number;
	size: string;
	color: string;
	price: number;
	_id: string;
  }
  
  export interface TOrderInfoShipping {
	name: string;
	email: string;
	phone: string;
	address: string;
	_id: string;
  }
  
  export interface TOrder {
	_id: string;
	userId: {
	  _id: string;
	  email: string;
	};
	status: string;
	note: string;
	paymentMethod: string;
	total: number;
	products: TOrderProduct[];
	infoOrderShipping: TOrderInfoShipping;
	priceShipping: number;
	reasonCancel: string;
	createdAt: string;
	updatedAt: string;
  }
  
  export interface TGetOrdersResponse {
	message: string;
	success: boolean;
	data: TOrder[];
  }
  