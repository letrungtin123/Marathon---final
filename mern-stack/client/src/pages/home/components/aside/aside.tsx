import { Link, createSearchParams } from "react-router-dom";

import { brandApi } from "@/api/brand.api";
import { categoryApi } from "@/api/category.api";
import path from "@/configs/path.config";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "@/hooks/useQueryParams";

const Aside = () => {
  const params = useQueryParams();

  // get all categories
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAllCategories({ status: "active" }),
  });
  const categories = data?.data?.filter(
    (category) => category.status === "active"
  );

  // get all brands
  const { data: responseBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandApi.getAllBrands({ status: "active" }),
  });
  const brands = responseBrands?.data?.filter(
    (brand) => brand.status === "active"
  );

  return (
    <aside className="pr-8">
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-green-900">
            Danh mục sản phẩm
          </h3>
          <ul className="space-y-4">
            {categories &&
              categories.length > 0 &&
              categories.map((category) => (
                <li
                  key={category._id}
                  className="relative rounded overflow-hidden"
                >
                  <img
                    src={category.image}
                    alt={category.nameCategory}
                    className="w-full h-48 object-cover rounded"
                  />
                  <Link
                    to={{
                      pathname: path.home,
                      search: createSearchParams({
                        ...params,
                        category: category._id,
                      }).toString(),
                    }}
                    className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 hover:underline"
                  >
                    {category.nameCategory}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold text-green-900">
            Các sản phẩm kết hợp thương hiệu
          </h3>
          <ul className="space-y-2">
            {brands &&
              brands.length > 0 &&
              brands.map((brand) => (
                <li key={brand._id}>
                  <Link
                    to={{
                      pathname: path.home,
                      search: createSearchParams({
                        ...params,
                        brand: brand._id,
                      }).toString(),
                    }}
                    className="text-green-900 hover:underline flex items-center font-semibold"
                  >
                    {brand.nameBrand}
                    {brand.image && (
                      <img
                        src={brand.image}
                        alt={brand.nameBrand}
                        className="w-8 h-8 ml-2 object-cover rounded"
                      />
                    )}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
