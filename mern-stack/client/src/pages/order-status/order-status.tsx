import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/format-currency.util";

import { CheckCircle, Eye } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import box from "@/assets/box.gif";
// import { useEffect, useState } from "react";
// import { orderApi } from "@/api/order.api";
// import { TOrder } from "@/types/order.type";
const orders = [
  {
    id: "od1",
    date: "05-05-2024",
    status: "completed",
    total: "1500000",
    items: 3,
  },
  {
    id: "od2",
    date: "05-05-2024",
    status: "delivery",
    total: "1500000",
    items: 3,
  },
  {
    id: "od1",
    date: "05-05-2024",
    status: "confirmed",
    total: "1500000",
    items: 3,
  },
  {
    id: "od1",
    date: "05-05-2024",
    status: "pending",
    total: "1500000",
    items: 3,
  },
  {
    id: "od1",
    date: "05-05-2024",
    status: "cancelled",
    total: "1500000",
    items: 3,
  },
];

const OrderStatus = () => {
  // const [orders, setOrders] = useState<TOrder[]>([]);
  // const userId = localStorage.getItem("userId") || "";

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       const data = await orderApi.getOrdersByUserId(userId);
  //       setOrders(data.data); // Gán danh sách đơn hàng từ API vào state
  //     } catch (error) {
  //       console.error("Lỗi khi lấy đơn hàng:", error);
  //     }
  //   };

  //   fetchOrders();
  // }, [userId]);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return {
          title: "Đã giao hàng",
          color: "bg-green-500",
        };
      case "delivery":
        return {
          title: "Đang vận chuyển",
          color: "bg-blue-500",
        };
      case "confirmed":
        return {
          title: "Đã xác nhận",
          color: "bg-orange-500",
        };
      case "pending":
        return {
          title: "Đang xử lý",
          color: "bg-yellow-500",
        };
      case "cancelled":
        return {
          title: "Đã huỷ",
          color: "bg-red-500",
        };
      default:
        return {
          title: "",
          color: "bg-gray-500",
        };
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Quản lý trạng thái đơn hàng</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => {
          const { color, title } = getStatusColor(order.status);
          return (
            <Card key={order.id} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  Đơn hàng #{order.id}
                </CardTitle>
                <Badge className={color}>{title}</Badge>
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(Number(order.total))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ngày đặt hàng: {order.date}
                </p>
              </CardContent>

              <Separator />

              <CardFooter className="flex justify-between">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <img src={box} alt="box" className="w-8 h-8 p-0 mb-2" />
                  <span className="">{order.items} sản phẩm</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"ghost"} size={"sm"}>
                      <Eye className="mr-2 size-4" />
                      Xem chi tiết
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Chi tiết đơn hàng #abcababcb</DialogTitle>
                    </DialogHeader>

                    <div className="">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="text-green-500 size-5" />
                          <span className="font-semibold">Đã giao hàng</span>
                        </div>

                        <span className="text-sm text-muted-foreground">
                          Ngày đặt hàng: 14/11/2024
                        </span>
                      </div>

                      <Separator className="my-4" />

                      <h3 className="mb-2 font-semibold">Sản phẩm</h3>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên sản phẩm</TableHead>
                            <TableHead>Màu sắc</TableHead>
                            <TableHead>Số lượng</TableHead>
                            <TableHead>Giá</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          <TableRow>
                            <TableCell>Đồng hồ nam</TableCell>
                            <TableCell>Trắng</TableCell>
                            <TableCell>10</TableCell>
                            <TableCell>
                              {formatCurrency(Number(10000))}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>

                      <div className="flex justify-end mt-4">
                        <span className="font-semibold">
                          Tổng cộng: {formatCurrency(40000)}
                        </span>
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="">
                          <h3 className="mb-2 font-semibold">
                            Địa chỉ giao hàng
                          </h3>
                          <p className="text-sm">Nam định</p>
                        </div>
                        <div className="">
                          <h3 className="mb-2 font-semibold">
                            Phương thức thanh toán
                          </h3>
                          <p className="text-sm">Cod</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Separator className="my-6" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chi tiết đơn hàng gần đây</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className="text-center">Số lượng sản phẩm</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => {
                const { color, title } = getStatusColor(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge className={color}>{title}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(Number(order.total))}</TableCell>
                    <TableCell className="text-center">{order.items}</TableCell>
                    {order.status === "pending" && (
                      <TableCell>
                        <Popover>
                          <PopoverTrigger>
                            <Button>Huỷ đơn hàng</Button>
                          </PopoverTrigger>
                          <PopoverContent side="top">
                            <div className="">
                              <p className="mb-4 text-base font-medium text-center">
                                Bạn có muốn huỷ đơn hàng?
                              </p>

                              <div className="flex items-center justify-center space-x-3">
                                <PopoverClose>
                                  <Button variant={"outline"}>Huỷ</Button>
                                </PopoverClose>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button>Xác nhận</Button>
                                  </DialogTrigger>

                                  <DialogContent className="[&>button]:hidden">
                                    <p className="text-base font-medium">
                                      Lý do huỷ đơn
                                    </p>

                                    <Textarea placeholder="Lý do huỷ đơn"></Textarea>

                                    <div className="flex justify-end w-full">
                                      <Button className="w-full">Gửi</Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStatus;
