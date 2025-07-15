import { useState, useEffect } from 'react'

// Định nghĩa interface cho sản phẩm trong chiến lược
interface Product {
  productId: string
  name: string
  price: number
  sale?: number
  image?: string
  bought_count: number
}

// Định nghĩa interface cho chiến lược kinh doanh
interface BusinessStrategyData {
  target_products: Product[]
  revenue_strategy: string
  market_trend: string
}

const BusinessStrategy = () => {
  const [strategy, setStrategy] = useState<BusinessStrategyData | null>(null)

  useEffect(() => {
    // Lấy dữ liệu chiến lược từ API Flask
    fetch('http://localhost:5000/business-strategy')
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error('Lỗi từ API:', data.error)
          setStrategy(null)
        } else {
          console.log('Dữ liệu chiến lược nhận được từ API:', data)
          setStrategy(data)
        }
      })
      .catch((error) => console.error('Error fetching strategy:', error))
  }, [])

  if (!strategy) {
    return <div className='text-center py-6 text-xl text-gray-500'>Đang tải chiến lược...</div>
  }

  return (
    <div className='max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl'>
      <h1 className='text-4xl font-semibold text-center mb-6 text-gray-800'>Chiến Lược Kinh Doanh Tháng Tới</h1>

      {/* Sản phẩm cần đẩy mạnh */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Sản phẩm cần đẩy mạnh:</h2>
        {strategy.target_products.length > 0 ? (
          <ul className='space-y-6'>
            {strategy.target_products.map((product) => {
              const finalPrice = Math.max(product.price - (product.sale || 0), 0)
              return (
                <li
                  key={product.productId}
                  className='flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow-md'
                >
                  <div className='flex-shrink-0'>
                    <img
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      className='w-24 h-24 object-cover rounded-lg shadow-md'
                    />
                  </div>
                  <div className='flex-grow'>
                    <h3 className='text-lg font-medium text-gray-800'>{product.name}</h3>
                    <p className='text-gray-600 text-sm'>
                      Giá khuyến mãi:{' '}
                      <span className='font-semibold text-green-600'>{finalPrice.toLocaleString()} VND</span>
                    </p>
                    {product.sale ? (
                      <p className='text-gray-400 text-sm line-through'>
                        Giá gốc: {product.price.toLocaleString()} VND
                      </p>
                    ) : null}
                    <p className='text-gray-600 text-sm'>Đã bán: {product.bought_count} sản phẩm</p>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className='text-lg text-gray-500'>Không có sản phẩm cần đẩy mạnh.</p>
        )}
      </div>

      {/* Chiến lược về doanh thu */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Chiến lược về doanh thu:</h2>
        <p className='text-lg text-gray-800'>{strategy.revenue_strategy}</p>
      </div>

      {/* Phân tích thị trường */}
      <div>
        <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Phân tích thị trường:</h2>
        <p className='text-lg text-gray-800'>{strategy.market_trend}</p>
      </div>
    </div>
  )
}

export default BusinessStrategy
