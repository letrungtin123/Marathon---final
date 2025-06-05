import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface RecommendedProduct {
  _id: string
  name: string
  price: number
  image: string
}

interface ForecastProduct extends RecommendedProduct {
  predicted_quantity: number
}

interface RecommendProps {
  userId: string
}

const Recommend: React.FC<RecommendProps> = ({ userId }) => {
  const [recommended, setRecommended] = useState<RecommendedProduct[]>([])
  const [forecasted, setForecasted] = useState<ForecastProduct[]>([])
  const [popular, setPopular] = useState<RecommendedProduct[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Gợi ý theo người dùng từ Flask
        const recRes = await axios.get(`http://localhost:5000/recommend/${userId}`)
        if (Array.isArray(recRes.data)) {
          setRecommended(recRes.data)
        } else {
          console.warn('⚠️ Recommend API trả về không phải array:', recRes.data)
        }

        // ✅ Dự đoán từ Flask
        const forecastRes = await axios.get('http://localhost:5000/forecast')
        if (Array.isArray(forecastRes.data)) {
          setForecasted(forecastRes.data)
        } else {
          console.warn('⚠️ Forecast API trả về không phải array:', forecastRes.data)
        }

        // ✅ Lấy sản phẩm bán chạy từ Flask
        const popularRes = await axios.get('http://localhost:5000/popular')
        if (Array.isArray(popularRes.data)) {
          setPopular(popularRes.data)
        } else {
          console.warn('⚠️ Popular API trả về không phải array:', popularRes.data)
        }
      } catch (err) {
        console.error('❌ Lỗi khi gọi API gợi ý sản phẩm:', err)
        setRecommended([])
        setForecasted([])
        setPopular([])
      }
    }

    if (userId) {
      fetchData()
    }
  }, [userId])

  return (
    <div className="p-4 space-y-8">
      {/* 🔥 Dự đoán sản phẩm bán chạy */}
      <section>
        <h2 className="text-lg font-bold mb-2">🔥 Dự đoán sản phẩm bán chạy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {forecasted.map((item) => (
            <div key={item._id} className="border p-2 rounded shadow">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="font-semibold mt-2">{item.name}</h3>
              <p className="text-sm text-gray-500">
                Dự đoán: <span className="text-green-600">{item.predicted_quantity} sản phẩm</span>
              </p>
              <p className="text-red-500">{item.price.toLocaleString()}₫</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🧠 Sản phẩm phù hợp với bạn */}
      <section>
        <h2 className="text-lg font-bold mb-2">🧠 Gợi ý theo người dùng</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommended.map((item) => (
            <div key={item._id} className="border p-2 rounded shadow">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="font-semibold mt-2">{item.name}</h3>
              <p className="text-red-500">{item.price.toLocaleString()}₫</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🚀 Sản phẩm bán chạy */}
      <section>
        <h2 className="text-lg font-bold mb-2">🚀 Sản phẩm bán chạy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popular.map((item) => (
            <div key={item._id} className="border p-2 rounded shadow">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded"
              />
              <h3 className="font-semibold mt-2">{item.name}</h3>
              <p className="text-red-500">{item.price.toLocaleString()}₫</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Recommend
