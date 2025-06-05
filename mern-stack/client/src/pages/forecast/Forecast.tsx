import React, { useEffect, useState } from "react";
import axios from "axios";

interface ForecastProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  predicted_quantity: number;
}

const Forecast: React.FC = () => {
  const [products, setProducts] = useState<ForecastProduct[]>([]);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get("http://localhost:5001/forecast");
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu dự đoán:", err);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🔥 Dự đoán sản phẩm bán chạy tháng tới</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p._id} className="border rounded shadow p-4">
            <img src={p.image} alt={p.name} className="w-full h-32 object-cover mb-2" />
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.price.toLocaleString()} ₫</p>
            <p className="text-xs text-green-600">Dự đoán bán: {p.predicted_quantity} sp</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
