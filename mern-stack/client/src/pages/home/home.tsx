import Aside from "./components/aside"
import Card from "./components/card"
import { productApi } from "@/api/product.api"
import { useQuery } from "@tanstack/react-query"
import { useQueryParams } from "@/hooks/useQueryParams"
import { Carousel } from "antd"
import Recommend from "../Recommend/Recommend"
import { getUserIdFromToken } from "@/utils/decode-token.util"
import Chatbot from "../chatbot/ChatBot"

const HomePage = () => {
  const params = useQueryParams()
  const userId = getUserIdFromToken()
  console.log("✅ userId:", userId)

  const { data } = useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      productApi.getProducts({ ...params, deleted: "false", status: "active" }),
  })
  const products = data?.docs
  const isParamsEmpty = Object.keys(params).length === 0

  const carouselContainerStyle: React.CSSProperties = {
    marginTop: "35px",
    borderRadius: "10px",
    overflow: "hidden", // để ảnh bo góc đẹp
    maxHeight: "400px",
    width: "100%",
  }

  const imageStyle: React.CSSProperties = {
    width: "100%",
    height: "400px",
    objectFit: "cover",
    display: "block",
  }

  return (
    <main className="container flex flex-col flex-grow px-4 py-2 mx-auto mt-0 space-y-6" style={{ minHeight: "100vh" }}>
      {/* Phần Carousel */}
      {isParamsEmpty && (
        <Carousel
          effect="fade"
          arrows
          infinite={true}
          autoplay
          autoplaySpeed={1600}
          className="mb-8"
          style={carouselContainerStyle}
        >
          <div>
            <img
              src="https://nhahoa.com.vn/wp-content/uploads/2021/04/background-nha-hoa-gui-trao-cam-xuc_optimized.png"
              alt="Slide 1"
              style={imageStyle}
            />
          </div>
          <div>
            <img
              src="https://www.flowerstoreinabox.com.au/images/uploads/2017/03/mday-2017-4.jpg"
              alt="Slide 2"
              style={imageStyle}
            />
          </div>
          <div>
            <img
              src="https://www.ibuyflowers.com/hubfs/Wed%20love%20your%20feedback%20%287%29.png"
              alt="Slide 3"
              style={imageStyle}
            />
          </div>
          <div>
            <img
              src="https://floranext.com/wp-content/uploads/2016/12/Christmas-2016-5.jpg"
              alt="Slide 4"
              style={imageStyle}
            />
          </div>
        </Carousel>
      )}

      {/* Phần dưới gồm Aside và danh sách sản phẩm */}
      <div className="flex flex-col lg:flex-row flex-grow space-y-6 lg:space-y-0" style={{ minHeight: "600px" }}>
        {/* Bao ngoài Aside để sticky và scroll riêng */}
        <div
          style={{
            position: "sticky",
            top: "80px", // khoảng cách từ trên viewport khi sticky
            alignSelf: "flex-start", // để sticky không bị co kéo chiều ngang
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
            flexBasis: "25%", // để giữ chiều rộng bên desktop, bạn có thể tùy chỉnh
          }}
        >
          <Aside />
        </div>

        {/* Danh sách sản phẩm */}
        <div className="lg:w-9/12 w-full">
          <section>
            <p className="text-lg font-semibold text-green-900">Các sản phẩm nổi bật</p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3 mt-4">
              {products &&
                products.length > 0 &&
                products.map((product) => {
                  return <Card key={product._id} product={product} />
                })}
              {!products || (products.length === 0 && <div>No Product</div>)}
            </div>
          </section>
          {userId && <Recommend userId={userId} />}
          <Chatbot />
        </div>
      </div>
    </main>
  )
}

export default HomePage
