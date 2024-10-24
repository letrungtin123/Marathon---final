import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, CreditCard } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

const Checkout = () => {
	const [paymentMethod, setPaymentMethod] = useState('credit-card');

	const cartItems = [
		{ id: 1, name: 'Smartphone XYZ', price: 599.99, quantity: 1 },
		{ id: 2, name: 'Wireless Earbuds', price: 129.99, quantity: 2 },
	];

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const shipping = 10;
	const tax = subtotal * 0.1;
	const total = subtotal + shipping + tax;
	return (
		<div className="w-full min-h-screen bg-gray-100">
			<div className="container px-4 py-8 mx-auto">
				<Button variant="ghost" className="mb-6">
					<ChevronLeft className="w-4 h-4 mr-2" />
					Quay lại giỏ hàng
				</Button>
				<h1 className="mb-8 text-3xl font-bold">Thanh toán</h1>
				<div className="grid gap-8 md:grid-cols-3">
					<div className="space-y-6 md:col-span-2">
						<div className="p-6 bg-white rounded-lg shadow">
							<h2 className="mb-4 text-xl font-semibold">
								Thông tin giao hàng
							</h2>
							<div className="grid gap-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="firstName">Họ</Label>
										<Input id="firstName" placeholder="Nhập họ" />
									</div>
									<div>
										<Label htmlFor="lastName">Tên</Label>
										<Input id="lastName" placeholder="Nhập tên" />
									</div>
								</div>
								<div>
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										type="email"
										placeholder="you@example.com"
									/>
								</div>
								<div>
									<Label htmlFor="phone">Số điện thoại</Label>
									<Input id="phone" type="tel" placeholder="0123456789" />
								</div>
								<div>
									<Label htmlFor="address">Địa chỉ</Label>
									<Input id="address" placeholder="Số nhà, tên đường" />
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label htmlFor="city">Thành phố</Label>
										<Input id="city" placeholder="Thành phố" />
									</div>
									<div>
										<Label htmlFor="postalCode">Mã bưu điện</Label>
										<Input id="postalCode" placeholder="Mã bưu điện" />
									</div>
								</div>
								<div>
									<Label htmlFor="country">Quốc gia</Label>
									<Select>
										<SelectTrigger id="country">
											<SelectValue placeholder="Chọn quốc gia" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="vn">Việt Nam</SelectItem>
											<SelectItem value="us">United States</SelectItem>
											<SelectItem value="uk">United Kingdom</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>
						<div className="p-6 bg-white rounded-lg shadow">
							<h2 className="mb-4 text-xl font-semibold">
								Phương thức thanh toán
							</h2>
							<RadioGroup
								value={paymentMethod}
								onValueChange={setPaymentMethod}
							>
								<div className="flex items-center mb-2 space-x-2">
									<RadioGroupItem value="credit-card" id="credit-card" />
									<Label htmlFor="credit-card">Thẻ tín dụng</Label>
								</div>
								<div className="flex items-center mb-2 space-x-2">
									<RadioGroupItem value="paypal" id="paypal" />
									<Label htmlFor="paypal">PayPal</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="bank-transfer" id="bank-transfer" />
									<Label htmlFor="bank-transfer">Chuyển khoản ngân hàng</Label>
								</div>
							</RadioGroup>
							{paymentMethod === 'credit-card' && (
								<div className="mt-4 space-y-4">
									<div>
										<Label htmlFor="cardNumber">Số thẻ</Label>
										<Input id="cardNumber" placeholder="1234 5678 9012 3456" />
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="expiryDate">Ngày hết hạn</Label>
											<Input id="expiryDate" placeholder="MM/YY" />
										</div>
										<div>
											<Label htmlFor="cvv">CVV</Label>
											<Input id="cvv" placeholder="123" />
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
					<div>
						<div className="p-6 bg-white rounded-lg shadow">
							<h2 className="mb-4 text-xl font-semibold">Tóm tắt đơn hàng</h2>
							<div className="space-y-4">
								{cartItems.map((item) => (
									<div key={item.id} className="flex justify-between">
										<span>
											{item.name} x {item.quantity}
										</span>
										<span>${(item.price * item.quantity).toFixed(2)}</span>
									</div>
								))}
								<Separator />
								<div className="flex justify-between">
									<span>Tạm tính</span>
									<span>${subtotal.toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Phí vận chuyển</span>
									<span>${shipping.toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Thuế</span>
									<span>${tax.toFixed(2)}</span>
								</div>
								<Separator />
								<div className="flex justify-between font-semibold">
									<span>Tổng cộng</span>
									<span>${total.toFixed(2)}</span>
								</div>
							</div>
							<Button className="w-full mt-6">
								<CreditCard className="w-4 h-4 mr-2" />
								Thanh toán ${total.toFixed(2)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;
