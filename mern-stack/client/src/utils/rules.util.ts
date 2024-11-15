import * as yup from "yup";

const phoneRegExp =
	/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const schema = yup.object({
	email: yup
		.string()
		.email("Email không hợp lệ")
		.required("Email không được để trống"),
	password: yup
		.string()
		.required("Mật khẩu không được để trống")
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự")
		.max(160, "Mật khẩu không được quá 20 ký tự"),
	confirmPassword: yup
		.string()
		.required("Mật khẩu không được để trống")
		.min(6, "Mật khẩu phải có ít nhất 6 ký tự")
		.max(160, "Mật khẩu không được quá 20 ký tự"),
	firstName: yup.string().required("Firstname không được để trống"),
	lastName: yup.string().required("Lastname không được để trống"),
	note: yup.string().max(1000, "Ghi chú không được quá 1000 ký tự"),
	address: yup.string().required("Địa chỉ không được để trống"),
	phone: yup.string().matches(phoneRegExp, "Số điện thoại không hợp lệ"),
});

// khai báo kiểu dữ liệu cho schema
export type SchemaType = yup.InferType<typeof schema>;