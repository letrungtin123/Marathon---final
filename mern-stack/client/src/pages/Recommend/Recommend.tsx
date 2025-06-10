import React, { useEffect, useState } from "react";
import axios from "axios";
import MiniCard from "@/components-ml/miniCard";
import fire from "@/assets/fire.gif";

interface RecommendedProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface ForecastProduct extends RecommendedProduct {
  predicted_quantity: number;
}

interface RecommendProps {
  userId: string;
}

const Recommend: React.FC<RecommendProps> = ({ userId }) => {
  const [recommended, setRecommended] = useState<RecommendedProduct[]>([]);
  const [forecasted, setForecasted] = useState<ForecastProduct[]>([]);
  const [popular, setPopular] = useState<RecommendedProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recRes = await axios.get(
          `http://localhost:5000/recommend/${userId}`
        );
        const forecastRes = await axios.get("http://localhost:5000/forecast");
        const popularRes = await axios.get("http://localhost:5000/popular");

        setRecommended(Array.isArray(recRes.data) ? recRes.data : []);
        setForecasted(Array.isArray(forecastRes.data) ? forecastRes.data : []);
        setPopular(Array.isArray(popularRes.data) ? popularRes.data : []);
      } catch (err) {
        console.error("❌ Lỗi khi gọi API gợi ý sản phẩm:", err);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  return (
    <div className="p-6 space-y-10">
      <div>
        <section>
          <div className="flex items-center  mb-4">
            <img src={fire} alt="" className="w-8 h-8" />
            <h2 className="text-xl font-bold">Dự đoán sản phẩm bán chạy</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {forecasted.map((item) => (
              <MiniCard key={item._id} {...item} />
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-4">🧠 Gợi ý theo người dùng</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommended.map((item) => (
            <MiniCard key={item._id} {...item} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">🚀 Sản phẩm bán chạy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popular.map((item) => (
            <MiniCard key={item._id} {...item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Recommend;
