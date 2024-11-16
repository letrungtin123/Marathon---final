import { useState } from "react";

const VNPayPayment = () => {
  const [amount, setAmount] = useState("");
  const [orderDescription, setOrderDescription] = useState("");
  const [bankCode, setBankCode] = useState("");

  const handlePayment = async () => {
    const response = await fetch(
      "http://localhost:8080/api/v1/create_payment_url",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, orderDescription, bankCode }),
      }
    );

    const data = await response.json();
    if (data.paymentUrl) {
      window.location.href = data.paymentUrl;
    } else {
      alert("Lỗi khi tạo URL thanh toán");
    }
  };

  return (
    <div>
      <h1>Thanh toán VNPay</h1>
      <input
        type="number"
        placeholder="Nhập số tiền"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mô tả đơn hàng"
        value={orderDescription}
        onChange={(e) => setOrderDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mã ngân hàng (nếu có)"
        value={bankCode}
        onChange={(e) => setBankCode(e.target.value)}
      />
      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
};

export default VNPayPayment;
