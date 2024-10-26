import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { TSize } from "@/types/product.type";
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ProductControllerProps {
	variants: TSize[];
	onVariantSelect: (variant: TSize | null, quantity: number) => void;
}

const ProductController = ({
	variants,
	onVariantSelect,
}: ProductControllerProps) => {
	const [selectedSize, setSelectedSize] = useState<string | null>(null);
	const [selectedColor, setSelectedColor] = useState<string | null>(null);
	const [quantity, setQuantity] = useState<number>(1);

	// get unique size
	const uniqueSizes = useMemo(() => {
		const sizes = new Set(variants.map((varian) => varian.size));
		const result = Array.from(sizes).map((size) => {
			return {
				size: size,
				_id: variants?.find((variant) => variant.size === size)?._id ?? "",
			};
		});
		return result;
	}, [variants]);

	// get unique color
	const uniqueColors = useMemo(() => {
		if (selectedSize) {
			//logic
			const colors = variants.filter(
				(variant) => variant.size === selectedSize
			);
			return colors;
		} else {
			const colors = new Set(variants.map((varian) => varian.color));
			const result = Array.from(colors).map((color) => {
				return {
					color: color,
					_id: variants?.find((variant) => variant.color === color)?._id ?? "",
				};
			});
			return result;
		}
	}, [variants, selectedSize]);

	// get selectd varian
	const selectedVariant = useMemo(() => {
		if (selectedColor && selectedSize) {
			return variants.find(
				(variant) =>
					variant.size === selectedSize && variant._id === selectedColor
			);
		}
	}, [selectedColor, selectedSize, variants]);

	// handle size change
	const handleSizeChange = (size: string) => {
		setSelectedSize(size);
		setSelectedColor(null);
	};

	// handle color change
	const handleColorChange = (color: string) => {
		setSelectedColor(color);
	};

	// handle quantity
	const handleChangeQuantity = (value: number) => {
		if (selectedVariant) {
			setQuantity(Math.max(1, Math.min(value, selectedVariant.quantity)));
		}
	};

	useEffect(() => {
		if (selectedVariant !== undefined) {
			onVariantSelect(selectedVariant, quantity);
		}
	}, [selectedVariant, onVariantSelect, quantity]);

	return (
		<div className="space-y-4">
			<div>
				<h3 className="mb-2 text-lg font-semibold">Size</h3>
				<RadioGroup
					value={selectedSize ?? ""}
					onValueChange={handleSizeChange}
					className="flex space-x-2"
				>
					{uniqueSizes?.map((size) => (
						<div key={size._id}>
							<RadioGroupItem
								value={size.size}
								id={`size-${size._id}`}
								className="sr-only peer"
							/>
							<Label
								htmlFor={`size-${size._id}`}
								className={cn(
									"flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-md cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50",
									{
										"border-2 border-blue-500": selectedSize === size.size,
									}
								)}
							>
								{size.size}
							</Label>
						</div>
					))}
				</RadioGroup>
			</div>

			<div>
				<h3 className="mb-2 text-lg font-semibold">Color</h3>
				<RadioGroup
					value={selectedColor ?? ""}
					onValueChange={handleColorChange}
					className="flex space-x-2"
				>
					{uniqueColors.map((color) => (
						<div key={color._id}>
							<RadioGroupItem
								value={color._id}
								id={`color-${color._id}`}
								className="sr-only peer"
							/>
							<Label
								htmlFor={`color-${color._id}`}
								className={cn(
									"flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-200 rounded-full cursor-pointer peer-checked:border-blue-500",
									{ "border-blue-500": selectedColor === color._id }
								)}
								style={{ backgroundColor: color.color }}
							>
								<span className="sr-only">{color.color}</span>
							</Label>
						</div>
					))}
				</RadioGroup>
			</div>

			{selectedVariant && (
				<div className="mt-4">
					<h3 className="text-lg font-medium">Selected Variant</h3>
					<p>Size: {selectedVariant.size}</p>
					<p>Color: {selectedVariant.color}</p>
					<p className="">Quantity: {selectedVariant.quantity}</p>

					<div className="">
						<h4 className="mb-2 text-sm font-medium">Quantity</h4>

						<div className="flex items-center space-x-2">
							{/* handle click decrease quantity */}
							<Button
								variant={"outline"}
								size={"icon"}
								onClick={() => handleChangeQuantity(quantity - 1)}
								disabled={quantity === 1}
							>
								<Minus className="size-4" />
							</Button>
							{/* handle input change quantity */}
							<Input
								type="number"
								value={quantity}
								className="w-20 text-center"
								min={1}
								onChange={(e) =>
									handleChangeQuantity(parseInt(e.target.value, 10))
								}
								max={selectedVariant.quantity}
							/>
							{/* handle click increase quantity */}
							<Button
								variant={"outline"}
								size={"icon"}
								onClick={() => handleChangeQuantity(quantity + 1)}
								disabled={quantity === selectedVariant.quantity}
							>
								<Plus className="size-4" />
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProductController;