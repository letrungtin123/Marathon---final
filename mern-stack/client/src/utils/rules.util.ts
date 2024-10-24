import * as yup from 'yup';

export const schema = yup.object({
	email: yup
		.string()
		.email('Email không hợp lệ')
		.required('Email không được để trống'),
	password: yup
		.string()
		.required('Mật khẩu không được để trống')
		.min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
		.max(160, 'Mật khẩu không được quá 20 ký tự'),
	confirmPassword: yup
		.string()
		.required('Mật khẩu không được để trống')
		.min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
		.max(160, 'Mật khẩu không được quá 20 ký tự'),
	firstName: yup.string().required('Firstname không được để trống'),
});

// khai báo kiểu dữ liệu cho schema
export type SchemaType = yup.InferType<typeof schema>;
