import { TProduct } from "./product.type";

export type TAddToCart = {
	userId: string;
	productId: string;
	color: string;
	size: string;
	quantity: number;
};

export type Cart = {
	productId: Pick<
		TProduct,
		| "_id"
		| "nameProduct"
		| "sale"
		| "price"
		| "status"
		| "images"
		| "is_deleted"
		| "category"
		| "brand"
	>;
	quantity: number;
	color: string;
	size: string;
	_id: string;
};

export type TListCart = {
	_id: string;
	userId: string;
	carts: Cart[];
	total: number;
	createdAt: string;
	updatedAt: string;
};

export type TUpdateQuantityInCart = {
	userId: string;
	productId: string;
	productIdInCart: string;
};