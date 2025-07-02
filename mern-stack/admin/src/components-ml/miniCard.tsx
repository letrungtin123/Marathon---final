import { Star } from 'lucide-react'

import { formatCurrency } from '@/utils/format-currency'

interface MiniCardProps {
  _id: string
  name: string
  price: number
  image: string
  predicted_quantity?: number // Optional
}

const MiniCard = ({ name, price, image, predicted_quantity }: MiniCardProps) => {
  return (
    <div className='overflow-hidden bg-white rounded-lg shadow-md flex flex-col w-full h-full'>
      <img src={image} alt={name} className='object-cover w-full h-48' />
      <div className='p-4 flex-1 flex flex-col'>
        <h3 className='mb-2 text-lg font-medium line-clamp-2'>{name}</h3>

        <div className='flex items-center mb-2 mt-auto'>
          <span className='mr-2 font-bold text-red-600'>{formatCurrency(price)}đ</span>
          {predicted_quantity !== undefined && (
            <span className='ml-auto text-xs text-green-600'>🔮 {predicted_quantity} sp</span>
          )}
        </div>

        <div className='flex items-center'>
          <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
          <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
          <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
          <Star className='w-4 h-4 text-yellow-400 fill-yellow-400' />
          <Star className='w-4 h-4 text-yellow-400' />
          <span className='ml-1 text-sm text-gray-500'>(4.0)</span>
        </div>
      </div>
    </div>
  )
}

export default MiniCard
