// Forecast.tsx
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import fire from '@/assets/images/fire.gif'
import MiniCard from '@/components-ml/miniCard'

interface ForecastProduct {
  _id: string
  name: string
  price: number
  image: string
  predicted_quantity: number
}

const Forecast: React.FC = () => {
  const [forecasted, setForecasted] = useState<ForecastProduct[]>([])

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get('http://localhost:5000/forecast')
        setForecasted(Array.isArray(res.data) ? res.data : [])
      } catch (err) {
        console.error('❌ Lỗi khi gọi API dự đoán sản phẩm:', err)
      }
    }

    fetchForecast()
  }, [])

  return (
    <div className='p-6 space-y-10'>
      <div>
        <section>
          <div className='flex items-center mb-4'>
            <img src={fire} alt='' className='w-8 h-8' />
            <h2 className='text-xl font-bold'>Hello</h2>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {forecasted.map((item) => (
              <MiniCard key={item._id} {...item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Forecast
