import os
import pandas as pd
import requests
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.errors import InvalidId
from sklearn.linear_model import LinearRegression
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
from dotenv import load_dotenv
import joblib
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.losses import MeanSquaredError  # ✅ NEW

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/*": {"origins": ["http://localhost:4200", "http://localhost:3000"]}
})

# MongoDB setup
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise Exception("❌ MONGO_URI not found")
client = MongoClient(mongo_uri)
db = client["test"]
orders = db["orders"]
products = db["products"]
users = db["users"]

# ✅ Load Deep Learning model và encoders
try:
    recommendation_model = load_model("recommendation_model.h5", custom_objects={"mse": MeanSquaredError()})
    user_encoder = joblib.load("user_encoder.pkl")
    product_encoder = joblib.load("product_encoder.pkl")
    all_product_ids = list(product_encoder.classes_)
    print("✅ Đã load mô hình gợi ý DL")
except Exception as e:
    print(f"⚠️ Không load được mô hình gợi ý DL: {e}")
    recommendation_model = None

# Lấy thông tin sản phẩm
def get_product_info(pid: str):
    try:
        obj_id = ObjectId(pid)
    except InvalidId:
        return None
    product = products.find_one({"_id": obj_id})
    if not product:
        return None
    price = float(product.get("price", 0))
    sale = float(product.get("sale", 0))
    return {
        "_id": str(product["_id"]),
        "name": product.get("nameProduct", ""),
        "price": price,
        "sale": sale,
        "image": product.get("images", [{}])[0].get("url", "")
    }

# Dự báo sản phẩm bán chạy
def run_forecast():
    data = []
    for order in orders.find():
        created_at = order.get("createdAt")
        if isinstance(created_at, dict) and "$date" in created_at:
            created_at = created_at["$date"]
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
            data.append({
                "productId": str(pid),
                "month": created_at.month,
                "year": created_at.year,
                "quantity": qty
            })

    df = pd.DataFrame(data)
    if df.empty:
        print("Không có dữ liệu đơn hàng để dự báo!")
        return [], []

    grouped = df.groupby(["productId", "year", "month"]).agg({"quantity": "sum"}).reset_index()
    grouped["time"] = grouped["year"] * 12 + grouped["month"]

    forecast = []
    for pid in grouped["productId"].unique():
        df_pid = grouped[grouped["productId"] == pid]
        if len(df_pid) < 2:
            continue
        X = df_pid[["time"]]
        y = df_pid["quantity"]
        model = LinearRegression()
        model.fit(X, y)
        next_time = X["time"].max() + 1
        predicted = model.predict([[next_time]])[0]
        forecast.append({
            "productId": pid,
            "predicted_quantity": max(int(predicted), 0)
        })

    forecast_sorted = sorted(forecast, key=lambda x: x["predicted_quantity"], reverse=True)
    product_freq = df.groupby("productId")["quantity"].sum().sort_values(ascending=False).head(8)
    top_selling = [{"productId": pid, "bought_count": int(qty)} for pid, qty in product_freq.items()]
    return top_selling, forecast_sorted

top_selling_result, forecast_result = run_forecast()

@app.route("/forecast", methods=["GET"])
def forecast_api():
    result = []
    total_revenue = 0
    for item in forecast_result[:8]:
        p = get_product_info(item["productId"])
        if p:
            price = p["price"]
            sale = p.get("sale", 0)
            discounted_price = max(price - sale, 0)
            quantity = item["predicted_quantity"]
            revenue = discounted_price * quantity
            total_revenue += revenue
            result.append({
                "_id": p["_id"],
                "name": p["name"],
                "price": discounted_price,
                "original_price": price,
                "sale": sale,
                "image": p["image"],
                "predicted_quantity": quantity,
                "predicted_revenue": revenue
            })
    return jsonify({
        "products": result,
        "total_revenue": round(total_revenue)
    })

@app.route("/popular", methods=["GET"])
def popular_products():
    result = []
    for item in top_selling_result:
        p = get_product_info(item["productId"])
        if p:
            result.append({**p, "bought_count": item["bought_count"]})
    return jsonify(result)

# ✅ Gợi ý sản phẩm dùng Deep Learning
@app.route("/recommend/<user_id>", methods=["GET"])
def recommend_user(user_id):
    if not recommendation_model:
        return jsonify([])

    try:
        user_encoded = user_encoder.transform([user_id])[0]
    except:
        return jsonify([])

    product_encoded = product_encoder.transform(all_product_ids)
    user_ids = np.full(len(product_encoded), user_encoded)

    predictions = recommendation_model.predict([user_ids, product_encoded], verbose=0).flatten()
    top_indices = predictions.argsort()[::-1][:5]
    top_product_ids = [all_product_ids[i] for i in top_indices]

    result = []
    for pid in top_product_ids:
        p = get_product_info(pid)
        if p:
            result.append(p)

    return jsonify(result)

# Lead scoring
try:
    lead_model = joblib.load("lead_model.pkl")
except:
    lead_model = None
    print("⚠️ Không tìm thấy model lead_model.pkl")

@app.route("/predicted-leads", methods=["GET"])
def get_predicted_leads():
    if not lead_model:
        return jsonify([])

    user_cursor = users.find({"role": "customer"})
    user_data = []
    for user in user_cursor:
        uid = str(user["_id"])
        created = user.get("createdAt")
        if isinstance(created, dict) and "$date" in created:
            created = created["$date"]
        if isinstance(created, str):
            created = datetime.fromisoformat(created.replace("Z", "+00:00"))
        age_days = (datetime.now() - created).days if created else 0

        order_list = list(orders.find({"userId": user["_id"]}))
        total_spent = sum(o.get("total", 0) for o in order_list)
        order_count = len(order_list)

        features = [[total_spent, order_count, age_days]]
        predicted = lead_model.predict(features)[0]
        if predicted == 1:
            user_data.append({
                "user_id": uid,
                "email": user.get("email", ""),
                "address": user.get("address", ""),
                "phone": user.get("phone", ""),
                "total_spent": total_spent,
                "order_count": order_count
            })
    return jsonify(user_data)

# Business strategy giả lập
def fetch_market_data():
    return {
        "market_trends": "Thị trường tiêu dùng tại Việt Nam đang phục hồi nhanh chóng.",
        "consumer_sentiment": "Tích cực"
    }

def run_business_strategy_ai():
    market_data = fetch_market_data()
    try:
        model = joblib.load("business_strategy_model.pkl")
        features = [market_data.get("market_trends"), market_data.get("consumer_sentiment")]
        predicted_strategy = model.predict([features])
        return {
            "revenue_strategy": predicted_strategy[0].get("revenue_strategy", "Tăng doanh thu"),
            "market_trend": predicted_strategy[0].get("market_trend", "Ổn định")
        }
    except:
        return {
            "revenue_strategy": "Tăng cường marketing và mở rộng kênh phân phối",
            "market_trend": market_data["market_trends"]
        }

@app.route("/business-strategy", methods=["GET"])
def business_strategy():
    try:
        market_data = fetch_market_data()
        strategy_from_ai = run_business_strategy_ai()
        top_selling_result, forecast_result = run_forecast()

        enriched_products = []
        for item in top_selling_result:
            p_info = get_product_info(item["productId"])
            if p_info:
                enriched_products.append({
                    "productId": item["productId"],
                    "name": p_info["name"],
                    "price": p_info["price"],
                    "sale": p_info["sale"],
                    "image": p_info["image"],
                    "bought_count": item["bought_count"]
                })

        strategy = {
            "target_products": enriched_products,
            "revenue_strategy": strategy_from_ai["revenue_strategy"],
            "market_trend": strategy_from_ai["market_trend"]
        }

        return jsonify(strategy)
    except Exception as e:
        return jsonify({"error": f"Không tìm thấy chiến lược kinh doanh. Lỗi: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
