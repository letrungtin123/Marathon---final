import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart } from "lucide-react";
import { cartApi } from "@/api/cart.api";
import { userApi } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import path from "@/configs/path.config";
import { useAuth } from "@/contexts/auth.context";
import { removeAccessTokenFromLS } from "@/utils/auth.util";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import coupon from "@/assets/coupon.png";
import home from "@/assets/home.gif";
import aboutus from "@/assets/documents.gif";
import flower from "@/assets/flower.gif";
import holicolor from "@/assets/holi-colors.gif";
import event from "@/assets/event.gif";
import love from "@/assets/kpop.gif";
const HeaderLayout = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getProfile(),
    retry: false,
    enabled: isAuthenticated,
  });
  const myInfo = data?.data;

  // get all cars
  const { data: responseCarts } = useQuery({
    queryKey: ["carts"],
    queryFn: () => cartApi.getAllCarts(),
    enabled: isAuthenticated,
    retry: 2,
  });

  const carts = responseCarts?.data;

  const handleLogout = () => {
		queryClient.removeQueries({ queryKey: ["carts"] });
		removeAccessTokenFromLS();
		setIsAuthenticated(false);
	};

  return (
    <header className="bg-white shadow-md sticky top-0 right-0 left-0 z-50">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <div className="flex items-center space-x-4">
          <section className="flex items-center justify-center w-full h-header">
            <Link
              to={`/`}
              className="text-xl font-extrabold font-nunito-sans flex items-center p-0 m-0"
            >
              <span className="text-primary">Dash</span>
              <span className="">Stack</span>
              <img src={flower} alt="flower" className="w-8 h-8 p-0 m-0" />
            </Link>
          </section>
          <div className="relative p-1">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-64 py-2 pl-10 pr-4 border rounded-full"
            />
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          </div>
          <section className="flex items-center justify-center w-full h-header">
            <Link
              to={`/`}
              className="text-xl font-extrabold font-nunito-sans flex px-3 justify-center items-center"
            >
              <Button variant="ghost" className="p-0 m-0">
                Trang chủ
              </Button>
              <img src={home} alt="Home" className="w-8 h-8 p-0 m-0" />
            </Link>
          </section>

          <DropdownMenu>
            <div className="flex items-center px-5">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 m-0">
                  Hoa lễ
                </Button>
              </DropdownMenuTrigger>
              <img
                src={holicolor}
                alt="Holi Color"
                className="p-0 m-0 w-8 h-8"
              />
            </div>

            <DropdownMenuContent className="w-56 bg-white border shadow-md">
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/category-1">Hoa lễ 20/10</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/category-2">Hoa tết</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/category-3">Hoa khai trương</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <div className="flex items-center px-5">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 m-0">
                  Hoa sự kiện
                </Button>
              </DropdownMenuTrigger>
              <img src={event} alt="Holi Color" className="p-0 m-0 w-8 h-8" />
            </div>
            <DropdownMenuContent className="w-56 bg-white border shadow-md">
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/category-1">Cổng hoa</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/category-2">Xe hoa</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/category-3">Hoa đặt bàn</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <div className="flex items-center px-5">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 m-0">
                  Hoa theo chủ đề
                </Button>
              </DropdownMenuTrigger>
              <img src={love} alt="Holi Color" className="p-0 m-0 w-8 h-8" />
            </div>
            <DropdownMenuContent className="w-56 bg-white border shadow-md">
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/category-1">Hoa tình yêu</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/category-2">Hoa chia buồn</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/category-3">Hoa chúc mừng</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/category-3">Hoa cảm ơn</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <section className="flex items-center justify-center w-full h-header">
            <Link
              to={path.aboutus}
              className="text-xl font-extrabold font-nunito-sans flex items-center px-0 gap-0"
            >
              <Button variant="ghost" className="p-0 m-0">
                Về chúng tôi{" "}
              </Button>
              <img src={aboutus} alt="Home" className="w-8 h-8 p-0 m-0" />
            </Link>
          </section>
        </div>
        <div className=" justify-center items-center">
          {" "}
          <img src={coupon} className="h-12 w-59" />
        </div>
        <div className="flex items-center space-x-4">
          <Link to={path.cart}>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-6 h-6" />

              <div className="absolute size-5 rounded-full top-0 right-0 bg-blue-500 text-white flex items-center justify-center text-xs">
                {carts?.carts?.length ?? 0}
              </div>
            </Button>
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="bg-transparent hover:bg-transparent"
                >
                  <img
                    className="rounded-full !h-8 !w-8"
                    src="https://picsum.photos/536/354"
                    alt="Avatar"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white border shadow-md"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col justify-start space-y-1">
                    <p className="text-sm font-medium leading-none text-left">
                      {myInfo?.email}
                    </p>
                    <p className="text-xs leading-none text-left text-muted-foreground">
                      {myInfo?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={path.profile}>Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"ghost"}
                    className="justify-start w-full p-0 text-left h-fit hover:bg-transparent"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={path.login} className="text-sm font-medium">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
