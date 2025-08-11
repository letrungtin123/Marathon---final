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

// Định nghĩa interface cho market trend chi tiết hơn
interface MarketTrend {
  quy_mo_tiem_nang: string
  kenh_phan_phoi: string[]
  xu_huong_tieu_dung: string[]
  mua_vu_cao_diem: string[]
  canh_tranh: string[]
  co_hoi: string[]
  thach_thuc: string[]
  // Các trường raw lớn bạn có thể không render hoặc render tùy ý
}

// Định nghĩa interface cho chiến lược kinh doanh
interface BusinessStrategyData {
  target_products: Product[]
  revenue_strategy: string
  market_trend: MarketTrend
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

  const { target_products, revenue_strategy, market_trend } = strategy

  return (
    <div className='max-w-6xl mx-auto p-8 bg-white shadow-lg rounded-xl'>
      <h1 className='text-4xl font-semibold text-center mb-6 text-gray-800'>Chiến Lược Kinh Doanh Tháng Tới</h1>

      {/* Sản phẩm cần đẩy mạnh */}
      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Sản phẩm cần đẩy mạnh:</h2>
        {target_products.length > 0 ? (
          <ul className='space-y-6'>
            {target_products.map((product) => {
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
        <p className='text-lg text-gray-800'>{revenue_strategy}</p>
      </div>

      {/* Phân tích thị trường */}
      <div>
        <h2 className='text-2xl font-semibold mb-4 text-gray-700'>Phân tích thị trường:</h2>

        <p className='mb-4 text-lg font-semibold text-gray-700'>Quy mô tiềm năng:</p>
        <p className='mb-6 text-gray-800'>{market_trend.quy_mo_tiem_nang}</p>

        <p className='mb-4 text-lg font-semibold text-gray-700'>Kênh phân phối:</p>
        <ul className='list-disc list-inside mb-6 text-gray-800'>
          {market_trend.kenh_phan_phoi.map((channel, idx) => (
            <li key={idx}>{channel}</li>
          ))}
        </ul>

        <p className='mb-4 text-lg font-semibold text-gray-700'>Xu hướng tiêu dùng:</p>
        <ul className='list-disc list-inside mb-6 text-gray-800'>
          {market_trend.xu_huong_tieu_dung.map((trend, idx) => (
            <li key={idx}>{trend}</li>
          ))}
        </ul>

        <p className='mb-4 text-lg font-semibold text-gray-700'>Mùa vụ cao điểm:</p>
        <ul className='list-disc list-inside mb-6 text-gray-800'>
          {market_trend.mua_vu_cao_diem.map((season, idx) => (
            <li key={idx}>{season}</li>
          ))}
        </ul>

        <p className='mb-4 text-lg font-semibold text-gray-700'>Đối thủ cạnh tranh:</p>
        <ul className='list-disc list-inside mb-6 text-gray-800'>
          {market_trend.canh_tranh.map((comp, idx) => (
            <li key={idx}>{comp}</li>
          ))}
        </ul>

        <p className='mb-4 text-lg font-semibold text-gray-700'>Cơ hội:</p>
        <ul className='list-disc list-inside mb-6 text-gray-800'>
          {market_trend.co_hoi.map((op, idx) => (
            <li key={idx}>{op}</li>
          ))}
        </ul>

        <p className='mb-4 text-lg font-semibold text-gray-700'>Thách thức:</p>
        <ul className='list-disc list-inside mb-6 text-gray-800'>
          {market_trend.thach_thuc.map((challenge, idx) => (
            <li key={idx}>{challenge}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default BusinessStrategy
