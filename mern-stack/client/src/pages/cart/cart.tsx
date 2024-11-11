import { ChevronRight, Minus, Plus } from "lucide-react";

import { cartApi } from "@/api/cart.api";
import { userApi } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import path from "@/configs/path.config";

import { Cart as CartType, TUpdateQuantityInCart } from "@/types/cart.type";
import { formatCurrency } from "@/utils/format-currency.util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { omit } from "lodash";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/stores/hook";
import { RootState } from "@/stores/store";
import { addToListCheckout } from "@/stores/features/cart/cart-slice";

const Cart = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { carts: cartsListStore } = useAppSelector(
    (state: RootState) => state.cart
  );
  console.log("🚀 ~ Cart ~ carts:", cartsListStore);

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getProfile(),
  });
  const myInfo = data?.data;

  // get all cars
  const { data: responseCarts } = useQuery({
    queryKey: ["carts"],
    queryFn: () => cartApi.getAllCarts(),
  });
  const total = responseCarts?.data?.total;
  const carts = responseCarts?.data?.carts;

  const [cartItems, setCartItems] = useState<CartType[] | undefined>(carts);

  const updateQuatityMutation = useMutation({
    mutationKey: ["update-quantity"],
    mutationFn: (
      body: TUpdateQuantityInCart & { status: "increase" | "decrease" }
    ) =>
      cartApi.updateQuantityInCart(omit(body, ["status"]), {
        status: body.status,
      }),
  });

  const handleUpdateQuantity = (
    productId: string,
    productIdInCart: string,
    type: "increase" | "decrease"
  ) => {
    if (!myInfo) return;
    const body: TUpdateQuantityInCart & { status: "increase" | "decrease" } = {
      userId: myInfo._id,
      productId,
      productIdInCart,
      status: type,
    };
    updateQuatityMutation.mutate(body, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["carts"] });
        toast.success(
          body.status === "increase"
            ? "Đã tăng số lượng sản phẩm"
            : "Đã giảm số lượng sản phẩm"
        );
      },
    });
  };

  useEffect(() => {
    if (carts) {
      setCartItems(carts);
    }
  }, [carts]);

  if (!cartItems || cartItems.length === 0)
    return <p>Giỏ hàng của bạn đang trống.</p>;

  const handleCheckout = () => {
    dispatch(addToListCheckout(cartItems));
    navigate(path.checkout);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <nav className="py-2 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to={path.home} className="hover:text-gray-900">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Giỏ hàng của bạn</span>
          </div>
        </div>
      </nav>

      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center py-4 border-b">
                <img
                  src={item?.productId?.images[0]?.url}
                  alt={item?.productId?.nameProduct}
                  className="object-cover w-20 h-20 rounded"
                />
                <div className="flex-grow ml-4">
                  <h3 className="font-semibold">
                    {item?.productId?.nameProduct}
                  </h3>
                  <p className="">Size: {item?.size}</p>
                  <div className="flex items-center gap-3">
                    <span className="">Color: </span>
                    <button
                      type="button"
                      className={"size-6 rounded-full border"}
                      style={{ backgroundColor: item.color }}
                    ></button>
                  </div>
                  <p className="text-gray-600">
                    {formatCurrency(item?.productId?.price)}đ
                  </p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    // onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Giảm số lượng"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item._id,
                        "decrease"
                      )
                    }
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  {/* <Input
										type="number"
										min="1"
										value={item.quantity}
										// onChange={(e) =>
										// 	updateQuantity(item.id, parseInt(e.target.value))
										// }
										className="w-16 mx-2 text-center"
									/> */}
                  <div className="w-16 mx-2 text-center">{item.quantity}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    // onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Tăng số lượng"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item._id,
                        "increase"
                      )
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {/* <Button
                  variant="ghost"
                  size="icon"
                  // onClick={() => removeItem(item.id)}
                  className="ml-4"
                  aria-label="Xóa sản phẩm"
                >
                  <X className="w-4 h-4" />
                </Button> */}
              </div>
            ))}
          </div>
          <div className="lg:w-1/3">
            <div className="p-6 bg-gray-100 rounded-lg">
              <h2 className="mb-4 text-xl font-semibold">Tổng đơn hàng</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{total ? formatCurrency(total) : 0}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Giá ship:</span>
                  <span>10.000đ</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{total ? formatCurrency(total + 10000) : 0}đ</span>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-green-900"
                onClick={() => handleCheckout()}
              >
                Tiến hành thanh toán
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate(path.home)}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
