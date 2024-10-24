import path from '@/configs/path.config';
import { TProduct } from '@/types/product.type';
import { formatCurrency } from '@/utils/format-currency.util';
import { generateQueryString } from '@/utils/utils';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ICardProps {
	product: TProduct;
}

const Card = ({ product }: ICardProps) => {
	const discount = Math.round(
		100 - ((product.price - product.sale) * 100) / product.price
	);

	return (
		<Link
			to={{
				pathname: `${path.product}/${generateQueryString(
					product.nameProduct,
					product._id
				)}`,
			}}
		>
			<div className="overflow-hidden bg-white rounded-lg shadow-md flex flex-col w-full h-full">
				<img
					src={product.images[0].url}
					alt="Product"
					className="object-cover w-full h-48"
				/>
				<div className="p-4 flex-1 flex flex-col">
					<h3 className="mb-2 text-lg font-medium line-clamp-2">
						{product.nameProduct}
					</h3>
					<div className="flex items-center mb-2 mt-auto">
						<span className="mr-2 font-bold text-red-600">
							{product.sale
								? formatCurrency(product.price - product.sale)
								: formatCurrency(product.price)}
							đ
						</span>
						{product.sale > 0 && (
							<span className="text-sm text-gray-500 line-through">
								{formatCurrency(product.price)}đ
							</span>
						)}
						{discount > 0 && (
							<span className="ml-auto text-sm text-green-600">
								-{discount}%
							</span>
						)}
					</div>
					<div className="flex items-center">
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<Star className="w-4 h-4 text-yellow-400" />
						<span className="ml-1 text-sm text-gray-500">(4.0)</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default Card;
