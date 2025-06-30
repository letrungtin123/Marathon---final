// Recommend.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import MiniCard from "@/components-ml/miniCard";
import productForecast from "@/assets/productForecast.gif";
import bestseller from "@/assets/best-seller.gif";

interface RecommendedProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface RecommendProps {
  userId: string;
}

const Recommend: React.FC<RecommendProps> = ({ userId }) => {
  const [recommended, setRecommended] = useState<RecommendedProduct[]>([]);
  const [popular, setPopular] = useState<RecommendedProduct[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recRes = await axios.get(
          `http://localhost:5000/recommend/${userId}`
        );
        const popularRes = await axios.get("http://localhost:5000/popular");

        setRecommended(Array.isArray(recRes.data) ? recRes.data : []);
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
          <div className="flex items-center mb-4">
            <img src={productForecast} alt="" className="w-8 h-8" />
            <h2 className="text-xl font-bold">Gợi ý sản phẩm hot sắp tới</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommended.map((item) => (
              <MiniCard key={item._id} {...item} />
            ))}
          </div>
        </section>
      </div>

      <div>
        <section>
          <div className="flex items-center mb-4">
            <img src={bestseller} alt="" className="w-8 h-8" />
            <h2 className="text-xl font-bold">Sản phẩm bán chạy</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popular.map((item) => (
              <MiniCard key={item._id} {...item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Recommend;
