import path from "@/configs/path.config";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Result, Spin, Button } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
const VNPayResult = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPaymentResult = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const response = await fetch(
          `http://localhost:8080/api/v1/vnpay_ipn?${queryParams.toString()}`
        );
        const data = await response.json();
        setLoading(false);
        if (data.RspCode === "00") {
          setResult(data);
          toast.success("Thanh toán thành công!");

          // create order
        } else {
          toast.error("Thanh toán thất bại.");
          navigate(path.checkout); // Redirect về trang thanh toán nếu thất bại
        }
      } catch (error) {
        console.error("Error fetching payment result:", error);
        toast.error("Có lỗi xảy ra trong quá trình xử lý kết quả thanh toán.");
        navigate(path.checkout);
      }
    };

    fetchPaymentResult();
  }, [navigate]);

  return (
    <div className="container" style={{ marginTop: "50px" }}>
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
        </div>
      ) : result ? (
        <Result
          status="success"
          title="Thanh toán thành công!"
          subTitle={`Mã giao dịch: xincamon`}
          icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
          style={{ fontSize: "64px" }}
        />
      ) : (
        <Result
          status="error"
          title="Thanh toán thất bại"
          subTitle="Vui lòng thử lại hoặc liên hệ bộ phận hỗ trợ."
          icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
        />
      )}
      <div className="justify-center items-center flex">
        <Link to={path.home}>
          <Button className="bg-green-900 text-white">Quay về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
};
export default VNPayResult;
