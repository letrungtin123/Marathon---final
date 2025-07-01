import React, { useEffect, useState } from 'react'
import axios from 'axios'

import fire from '@/assets/images/fire.gif'
import MiniCard from '@/components-ml/miniCard'

interface ForecastProduct {
  _id: string
  name: string
  price: number
  original_price: number
  image: string
  sale: number
  predicted_quantity: number
  predicted_revenue: number
}

const Forecast: React.FC = () => {
  const [forecasted, setForecasted] = useState<ForecastProduct[]>([])
  const [summary, setSummary] = useState({ totalRevenue: 0, totalQuantity: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        setLoading(true)
        const res = await axios.get('http://localhost:5000/forecast')
        const { products, total_revenue } = res.data

        if (Array.isArray(products)) {
          const totalQty = products.reduce((sum, product) => {
            const qty = Number(product.predicted_quantity)
            return sum + (isNaN(qty) ? 0 : qty)
          }, 0)

          setForecasted(products)
          setSummary({
            totalRevenue: typeof total_revenue === 'number' ? total_revenue : 0,
            totalQuantity: totalQty
          })
        } else {
          setForecasted([])
          setSummary({ totalRevenue: 0, totalQuantity: 0 })
        }
      } catch (error) {
        console.error('❌ Lỗi gọi API /forecast:', error)
        setForecasted([])
        setSummary({ totalRevenue: 0, totalQuantity: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [])

  return (
    <div className='p-6 space-y-10'>
      <section>
        <div className='flex items-center mb-4'>
          <img src={fire} alt='fire' className='w-8 h-8' />
          <h2 className='text-xl font-bold'>Dự đoán các sản phẩm bán chạy trong tháng tới</h2>
        </div>

        {/* Loading state */}
        {loading ? (
          <p className='text-gray-500'>Đang tải dữ liệu dự đoán...</p>
        ) : (
          <>
            {/* Tổng doanh thu và số lượng */}
            <div className='mb-4 text-sm text-gray-700 space-y-1'>
              <p>
                <strong>Tổng doanh thu dự đoán:</strong>{' '}
                {summary.totalRevenue > 0 ? (
                  <span className='text-red-600 font-semibold'>{summary.totalRevenue.toLocaleString('vi-VN')} ₫</span>
                ) : (
                  <span>Chưa có dữ liệu doanh thu</span>
                )}
              </p>
              <p>
                <strong>Tổng số lượng sản phẩm bán được:</strong>{' '}
                {summary.totalQuantity > 0 ? (
                  <span className='text-green-600 font-semibold'>{summary.totalQuantity} sản phẩm</span>
                ) : (
                  <span>Chưa có sản phẩm nào</span>
                )}
              </p>
            </div>

            {/* Danh sách sản phẩm */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {forecasted.length > 0 ? (
                forecasted.map((item) => <MiniCard key={item._id} {...item} />)
              ) : (
                <p>Không có dữ liệu dự đoán.</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default Forecast
