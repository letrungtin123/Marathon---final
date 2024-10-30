import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, CreditCard, ShoppingCart, Star } from "lucide-react";

import { cartApi } from "@/api/cart.api";
import { productApi } from "@/api/product.api";
import { userApi } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import path from "@/configs/path.config";
import { TAddToCart } from "@/types/cart.type";
import { TSize } from "@/types/product.type";
import { formatCurrency } from "@/utils/format-currency.util";
import { getProductIdFromQueryString } from "@/utils/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import ProductController from "./components/product-controller";

const ProductDetail = () => {
  const queryClient = useQueryClient()
	const { productId } = useParams();
	const productIdFromQueryString = getProductIdFromQueryString(
		productId as string
	);

	// get product detail
	const { data } = useQuery({
		queryKey: ["product-detail"],
		queryFn: () => productApi.getProductById(productIdFromQueryString),
		enabled: !!productIdFromQueryString,
	});
	const product = data?.data;
	// get user id
	const { data: userData } = useQuery({
		queryKey: ["me"],
		queryFn: () => userApi.getProfile(),
		retry: false,
	});
	const myInfo = userData?.data;
	// create add to cart
	const addToCartMutation = useMutation({
		mutationKey: ["add-to-cart"],
		mutationFn: (body: TAddToCart) => cartApi.addToCart(body),
		onSuccess: () => {
			toast.success("Add to cart success!");
      queryClient.invalidateQueries({queryKey: ['carts']})
		},
		onError: () => {
			toast.error("Add to cart faild!");
		},
	});

	const [selectedVariant, setSelectedVariant] = useState<TSize | null>(null);
	const [selectedQuantity, setSelectedQuantity] = useState(1);

	const relatedProducts = [
		{
			id: 1,
			name: "Related Product 1",
			price: 89.99,
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 2,
			name: "Related Product 2",
			price: 79.99,
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 3,
			name: "Related Product 3",
			price: 99.99,
			image: "/placeholder.svg?height=200&width=200",
		},
		{
			id: 4,
			name: "Related Product 4",
			price: 69.99,
			image: "/placeholder.svg?height=200&width=200",
		},
	];

	const handleVariantSelect = (variant: TSize | null, quantity: number) => {
		setSelectedVariant(variant);
		setSelectedQuantity(quantity);
	};

	const handleAddToCart = () => {
		if (selectedVariant) {
			const data = {
				userId: myInfo?._id as string,
				productId: productIdFromQueryString,
				color: selectedVariant.color,
				size: selectedVariant.size,
				quantity: selectedQuantity,
			};
			addToCartMutation.mutate(data);
		} else {
			toast.warning("Please select a size, color and quantity");
		}
	};

	if (!product) return <div>Loading...</div>;

	const discount = Math.round(
		100 - ((product.price - product.sale) * 100) / product.price
	);

	return (
		<div className="flex flex-col h-full">
			{/* breadcrumb */}
			<nav className="py-2 bg-gray-100">
				<div className="container px-4 mx-auto">
					<div className="flex items-center space-x-2 text-sm text-gray-600">
						<Link to={path.home} className="hover:text-gray-900">
							Home
						</Link>
						<ChevronRight className="w-4 h-4" />
						<p className="hover:text-gray-900">Products</p>
						<ChevronRight className="w-4 h-4" />
						<span className="text-gray-900 font-medium">
							{product.nameProduct}
						</span>
					</div>
				</div>
			</nav>

			<main className="container flex-grow px-4 py-8 mx-auto">
				<div className="grid gap-8 mb-12 md:grid-cols-2">
					<div className="space-y-4 object-fill">
						<img
							src={product.images[0].url}
							alt="Product"
							className="w-full h-auto max-h-[450px] object-cover rounded-lg"
						/>
					</div>

					<div className="space-y-6">
						<h1 className="text-3xl font-medium flex items-center gap-4">
							{product?.nameProduct}{" "}
							{discount > 0 && (
								<span className="text-xs rounded-lg px-3 py-1 bg-primary text-white">
									-{discount}%
								</span>
							)}
						</h1>
						<div className="flex items-center space-x-2">
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-5 h-5 text-yellow-400"
										fill={i < 4 ? "currentColor" : "none"}
									/>
								))}
							</div>
							<span className="text-gray-600">(120 reviews)</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-2xl font-bold">
								{product?.sale
									? formatCurrency(product?.price - product?.sale)
									: formatCurrency(product?.price)}
								đ
							</span>
							{product.sale > 0 && (
								<span className="text-sm text-gray-500 line-through">
									{formatCurrency(product.price)}đ
								</span>
							)}
						</div>

						<ProductController
							variants={product.sizes}
							onVariantSelect={handleVariantSelect}
						/>

						<div className="flex space-x-4">
							<Button className="flex-1" onClick={() => handleAddToCart()}>
								<ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
							</Button>
							<Button variant="secondary" className="flex-1">
								<CreditCard className="w-4 h-4 mr-2" /> Buy Now
							</Button>
						</div>
					</div>
				</div>

				<Tabs defaultValue="description" className="mb-12">
					<TabsList>
						<TabsTrigger value="description">Description</TabsTrigger>
						<TabsTrigger value="specifications">Specifications</TabsTrigger>
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
					</TabsList>
					<TabsContent value="description" className="mt-4">
						<span>
							{product?.desc}
						</span>
					</TabsContent>
					<TabsContent value="specifications" className="mt-4">
						<ul className="pl-5 space-y-2 list-disc">
							<li>Specification 1: Value</li>
							<li>Specification 2: Value</li>
							<li>Specification 3: Value</li>
							<li>Specification 4: Value</li>
						</ul>
					</TabsContent>
					<TabsContent value="reviews" className="mt-4">
						<p>Customer reviews will be displayed here.</p>
					</TabsContent>
				</Tabs>

				<section className="mb-12">
					<h2 className="mb-6 text-2xl font-bold">Related Products</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{relatedProducts.map((product) => (
							<div key={product.id} className="p-4 border rounded-lg">
								<img
									src={"https://picsum.photos/536/354"}
									alt={product.name}
									className="object-cover w-full h-48 mb-4 rounded-md"
								/>
								<h3 className="font-semibold">{product.name}</h3>
								<p className="text-gray-600">${product.price.toFixed(2)}</p>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
};

export default ProductDetail;