import path from "@/configs/path.config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VNPayResult = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentResult = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const response = await fetch(
          `http://localhost:8080/api/v1/vnpay_return?${queryParams.toString()}`
        );
        const data = await response.json();
        if (data.code === "00") {
          setResult(data);
          toast.success("Thanh toán thành công!");
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
    <div className="container">
      <h1>Kết quả thanh toán</h1>
      {result ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p>Đang xử lý kết quả thanh toán...</p>
      )}
    </div>
  );
};

export default VNPayResult;
