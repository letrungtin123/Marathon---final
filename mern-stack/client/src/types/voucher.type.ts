export type TVoucher = {
	_id: string;
	code: string;
	discount: number;
	status: "active" | "inactive";
	is_deleted: boolean;
	desc: string;
	startDate: string;
	endDate: string;
	voucherPrice: number;
	applicablePrice: number;
	createdAt: string;
	updatedAt: string;
};