import Aside from "./components/aside";
import Card from "./components/card";
import { productApi } from "@/api/product.api";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "@/hooks/useQueryParams";
import { Carousel } from "antd";
const HomePage = () => {
  const params = useQueryParams();

  const { data } = useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      productApi.getProducts({ ...params, deleted: "false", status: "active" }),
  });
  const products = data?.docs;
  // Kiểm tra params có rỗng hay không
  const isParamsEmpty = Object.keys(params).length === 0;

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "400px",
    color: "#fff",
    textAlign: "center",
    marginTop: "35px",
    borderRadius: "10px",
    objectFit: "fill",
  };

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  return (
    <main className="container flex flex-col lg:flex-row flex-grow px-4 py-8 mx-auto space-y-6 lg:space-y-0">
      {/* Phần bên Aside */}
      <Aside />
      {/* Phần Carousel */}
      <div className="lg:w-9/12 w-full">
        {isParamsEmpty && (
          <Carousel
            effect="fade"
            arrows
            infinite={true}
            autoplay
            autoplaySpeed={1600}
            className="mb-8"
          >
            <div>
              <img
                src="https://assets.eflorist.com/images/homepage/immersion/immersion_banner_fall.gif"
                alt="Slide 1"
                style={{ ...imageStyle, ...contentStyle }}
              />
            </div>
            <div>
              <img
                src="https://assets.eflorist.com/images/homepage/immersion/immersion-get-well-flowers.jpg"
                alt="Slide 2"
                style={{ ...imageStyle, ...contentStyle }}
              />
            </div>
            <div>
              <img
                src="https://www.ibuyflowers.com/hubfs/Wed%20love%20your%20feedback%20%287%29.png"
                alt="Slide 3"
                style={{ ...imageStyle, ...contentStyle }}
              />
            </div>
            <div>
              <img
                src="https://assets.intleflorist.com/site/in3300079/Homepage/McIvor's.png"
                alt="Slide 4"
                style={{ ...imageStyle, ...contentStyle }}
              />
            </div>
          </Carousel>
        )}

        {/* Danh sách sản phẩm */}
        <section>
          <p className="text-lg font-semibold"> Các sản phẩm nổi bật </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 mt-4">
            {products &&
              products.length > 0 &&
              products.map((product) => {
                return <Card key={product._id} product={product} />;
              })}
            {!products || (products.length === 0 && <div>No Product</div>)}
          </div>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
