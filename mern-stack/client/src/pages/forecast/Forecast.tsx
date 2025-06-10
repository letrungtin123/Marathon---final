import React, { useEffect, useState } from "react";
import axios from "axios";
import MiniCard from "@/components-ml/miniCard";
import fire from "@/assets/fire.gif";

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
        const res = await axios.get("http://localhost:5000/forecast");
        setProducts(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu dự đoán:", err);
      }
    };

    fetchForecast();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        <img src={fire} alt="" className="p-0 m-0 w-8 h-8" />
        Dự đoán sản phẩm bán chạy tháng tới
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <MiniCard key={p._id} {...p} />
        ))}
      </div>
    </div>
  );
};

export default Forecast;
