import os
import pandas as pd
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
from datetime import datetime
from dotenv import load_dotenv
from collections import Counter
import json
import locale

# Đặt locale sang English để tránh auto dịch (nếu có)
try:
    locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
except locale.Error:
    pass  # Nếu hệ thống không hỗ trợ locale này thì bỏ qua

# Load biến môi trường
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    raise Exception("❌ MONGO_URI not found in .env")

client = MongoClient(mongo_uri)
db = client["marathon"]
orders = db["orders"]

# Bước 1: Trích xuất dữ liệu đơn hàng
data = []
product_freq = Counter()

for order in orders.find():
    created_at = order.get("createdAt")

    # Convert nếu là ISO string
    if isinstance(created_at, str):
        try:
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        except:
            continue

    if not isinstance(created_at, datetime):
        continue

    for p in order.get("products", []):
        pid = p.get("productId")
        qty = p.get("quantity")

        if not pid or qty is None:
            continue

        # Tính tần suất xuất hiện của sản phẩm
        product_freq[str(pid)] += 1

        data.append({
            "productId": str(pid),
            "month": created_at.month,
            "year": created_at.year,
            "quantity": qty
        })

df = pd.DataFrame(data)

# 1. Top sản phẩm được mua nhiều nhất
top_selling_result = [
    {"productId": pid, "bought_count": count}
    for pid, count in product_freq.most_common(8)
]

# 2. Dự đoán sản phẩm bán chạy tương lai
forecast_result = []

if not df.empty:
    grouped = df.groupby(["productId", "year", "month"]).agg({"quantity": "sum"}).reset_index()
    grouped["time"] = grouped["year"] * 12 + grouped["month"]

    for pid in grouped["productId"].unique():
        df_pid = grouped[grouped["productId"] == pid]
        if len(df_pid) < 2:
            continue

        X = df_pid[["time"]]
        y = df_pid["quantity"]

        model = LinearRegression()
        model.fit(X, y)

        next_month = X["time"].max() + 1
        predicted = model.predict([[next_month]])[0]

        forecast_result.append({
            "productId": pid,
            "predicted_quantity": max(int(predicted), 0)
        })

    forecast_result = sorted(forecast_result, key=lambda x: x["predicted_quantity"], reverse=True)

# Xuất ra file JSON
with open("top_selling_result.json", "w", encoding="utf-8") as f:
    json.dump(top_selling_result, f, ensure_ascii=False, indent=4)

with open("forecast_result.json", "w", encoding="utf-8") as f:
    json.dump(forecast_result, f, ensure_ascii=False, indent=4)

# sử dụng mô hình Linear Regression (Hồi quy tuyến tính) từ thư viện sklearn.linear_model để dự đoán lượng bán sản phẩm trong tháng tiếp theo dựa trên dữ liệu lịch sử.

# Cụ thể:

# Mô hình: LinearRegression (Hồi quy tuyến tính đơn giản)

# Mục đích: Tìm ra xu hướng số lượng sản phẩm bán ra theo thời gian (tính theo tháng), sau đó dự đoán số lượng bán của tháng tiếp theo.

# đoạn code đang train một mô hình hồi quy tuyến tính (một dạng mô hình học máy rất cơ bản) trên dữ liệu lịch sử (thời gian - số lượng).

# Nhưng đây không phải là AI phức tạp hay deep learning, mà chỉ là mô hình thống kê đơn giản dựa trên học máy (machine learning).

# Tóm lại:

# Đây là machine learning (học máy) chứ không phải deep learning hay AI phức tạp.

# Mô hình sử dụng là Linear Regression để dự đoán số lượng bán sản phẩm theo thời gian.

# Tóm tắt nhanh:

# Đoạn script này đang tự huấn luyện (per-product) một mô hình ML tuyến tính đơn giản (LinearRegression) trên chuỗi thời gian tháng→số lượng để dự đoán tháng kế tiếp. Không phải deep learning.

# Input dữ liệu: orders.createdAt, orders.products[].productId, orders.products[].quantity.

# Output:

# top_selling_result.json: top sản phẩm (nhưng hiện bạn đang đếm số dòng xuất hiện, không phải tổng số lượng).

# forecast_result.json: dự báo predicted_quantity cho tháng kế tiếp từng sản phẩm.

# Input (khi train, cho mỗi product):

# X: cột time có dạng year*12 + month → ma trận kích thước (n_tháng, 1).

# y: quantity (tổng số lượng bán theo tháng của sản phẩm đó) → vector (n_tháng,).

# Input (khi dự đoán):

# Giá trị time của tháng kế tiếp: next_time = max(time) + 1 (một số duy nhất).

# Output:

# Một giá trị dự báo số lượng cho tháng kế tiếp của từng sản phẩm (scalar), được ghi vào forecast_result.json dưới dạng:

# { "productId": "...", "predicted_quantity": <số nguyên không âm> }