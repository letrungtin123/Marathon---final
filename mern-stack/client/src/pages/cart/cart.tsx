import { ChevronRight, Minus, Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

interface CartItem {
	id: number;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

const Cart = () => {
	const [cartItems, setCartItems] = useState<CartItem[]>([
		{
			id: 1,
			name: 'Smartphone XYZ',
			price: 599.99,
			quantity: 1,
			image: 'https://picsum.photos/536/354',
		},
		{
			id: 2,
			name: 'Laptop ABC',
			price: 1299.99,
			quantity: 1,
			image: 'https://picsum.photos/536/354',
		},
		{
			id: 3,
			name: 'Wireless Earbuds',
			price: 129.99,
			quantity: 2,
			image: 'https://picsum.photos/536/354',
		},
	]);

	const updateQuantity = (id: number, newQuantity: number) => {
		setCartItems((items) =>
			items.map((item) =>
				item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
			)
		);
	};

	const removeItem = (id: number) => {
		setCartItems((items) => items.filter((item) => item.id !== id));
	};

	const subtotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.quantity,
		0
	);
	const tax = subtotal * 0.1; // Assuming 10% tax
	const total = subtotal + tax;

	return (
		<div className="container px-4 py-8 mx-auto">
			<nav className="py-2 bg-gray-100">
				<div className="container px-4 mx-auto">
					<div className="flex items-center space-x-2 text-sm text-gray-600">
						<a href="#" className="hover:text-gray-900">
							Home
						</a>
						<ChevronRight className="w-4 h-4" />
						<a href="#" className="hover:text-gray-900">
							Products
						</a>
						<ChevronRight className="w-4 h-4" />
						<span className="text-gray-900">Giỏ hàng của bạn</span>
					</div>
				</div>
			</nav>

			{cartItems.length === 0 ? (
				<p>Giỏ hàng của bạn đang trống.</p>
			) : (
				<div className="flex flex-col gap-8 lg:flex-row">
					<div className="lg:w-2/3">
						{cartItems.map((item) => (
							<div key={item.id} className="flex items-center py-4 border-b">
								<img
									src={item.image}
									alt={item.name}
									className="object-cover w-20 h-20 rounded"
								/>
								<div className="flex-grow ml-4">
									<h3 className="font-semibold">{item.name}</h3>
									<p className="text-gray-600">${item.price.toFixed(2)}</p>
								</div>
								<div className="flex items-center">
									<Button
										variant="outline"
										size="icon"
										onClick={() => updateQuantity(item.id, item.quantity - 1)}
										aria-label="Giảm số lượng"
									>
										<Minus className="w-4 h-4" />
									</Button>
									<Input
										type="number"
										min="1"
										value={item.quantity}
										onChange={(e) =>
											updateQuantity(item.id, parseInt(e.target.value))
										}
										className="w-16 mx-2 text-center"
									/>
									<Button
										variant="outline"
										size="icon"
										onClick={() => updateQuantity(item.id, item.quantity + 1)}
										aria-label="Tăng số lượng"
									>
										<Plus className="w-4 h-4" />
									</Button>
								</div>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => removeItem(item.id)}
									className="ml-4"
									aria-label="Xóa sản phẩm"
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						))}
					</div>
					<div className="lg:w-1/3">
						<div className="p-6 bg-gray-100 rounded-lg">
							<h2 className="mb-4 text-xl font-semibold">Tổng đơn hàng</h2>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span>Tạm tính:</span>
									<span>${subtotal.toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Thuế:</span>
									<span>${tax.toFixed(2)}</span>
								</div>
								<Separator className="my-2" />
								<div className="flex justify-between font-semibold">
									<span>Tổng cộng:</span>
									<span>${total.toFixed(2)}</span>
								</div>
							</div>
							<Button className="w-full mt-6">Tiến hành thanh toán</Button>
							<Button variant="outline" className="w-full mt-2">
								Tiếp tục mua sắm
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Cart;
