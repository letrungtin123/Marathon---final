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
