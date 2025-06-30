# server.py
import os
import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson.errors import InvalidId
from sklearn.linear_model import LinearRegression
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime
from collections import Counter
from dotenv import load_dotenv

# === Load biến môi trường ===
load_dotenv()

# === Tạo Flask app ===
app = Flask(__name__)

# ✅ Cấu hình CORS đúng chuẩn
CORS(app, supports_credentials=True, resources={
   r"/*": {"origins": ["http://localhost:4200", "http://localhost:3000"]}
})

# ✅ Import blueprint sau khi có app
from chatbot import chatbot_api
app.register_blueprint(chatbot_api)

# === Kết nối MongoDB ===
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise Exception("❌ MONGO_URI not found in .env")

client = MongoClient(mongo_uri)
db = client["test"]
orders = db["orders"]
products = db["products"]

# === Hàm lấy thông tin sản phẩm ===
def get_product_info(pid: str):
    try:
        obj_id = ObjectId(pid)
    except InvalidId:
        print(f"❌ Invalid ObjectId: {pid}")
        return None
    product = products.find_one({"_id": obj_id})
    if not product:
        return None
    return {
        "_id": str(product["_id"]),
        "name": product.get("nameProduct", ""),
        "price": product.get("price", 0),
        "image": product.get("images", [{}])[0].get("url", "")
    }

# === Dự báo ===
def run_forecast():
    data = []
    product_freq = Counter()
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
            product_freq[str(pid)] += 1
            data.append({
                "productId": str(pid),
                "month": created_at.month,
                "year": created_at.year,
                "quantity": qty
            })

    df = pd.DataFrame(data)
    top_selling = [{"productId": pid, "bought_count": count} for pid, count in product_freq.most_common(8)]
    forecast = []

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
            predicted = model.predict([[X["time"].max() + 1]])[0]
            forecast.append({
                "productId": pid,
                "predicted_quantity": max(int(predicted), 0)
            })

    return top_selling, sorted(forecast, key=lambda x: x["predicted_quantity"], reverse=True)

top_selling_result, forecast_result = run_forecast()

@app.route("/forecast", methods=["GET"])
def forecast_api():
    result = []
    for item in forecast_result[:8]:
        p = get_product_info(item["productId"])
        if p:
            result.append({**p, "predicted_quantity": item["predicted_quantity"]})
    return jsonify(result)

@app.route("/popular", methods=["GET"])
def popular_products():
    result = []
    for item in top_selling_result:
        p = get_product_info(item["productId"])
        if p:
            result.append({**p, "bought_count": item["bought_count"]})
    return jsonify(result)

@app.route("/recommend/<user_id>", methods=["GET"])
def recommend_user(user_id):
    data = []
    for order in orders.find():
        uid = str(order.get("userId"))
        for product in order.get("products", []):
            pid = str(product.get("productId"))
            data.append((uid, pid))

    df = pd.DataFrame(data, columns=["user", "product"])
    matrix = pd.crosstab(df["user"], df["product"])
    if user_id not in matrix.index:
        return jsonify([])

    sim = cosine_similarity(matrix)
    sim_df = pd.DataFrame(sim, index=matrix.index, columns=matrix.index)
    similar_users = sim_df[user_id].sort_values(ascending=False)[1:4]

    recommendations = {}
    for sim_user in similar_users.index:
        user_products = matrix.loc[sim_user]
        for product_id, bought in user_products.items():
            if bought > 0 and matrix.loc[user_id][product_id] == 0:
                recommendations[product_id] = recommendations.get(product_id, 0) + bought

    sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:5]
    result = []
    for pid, _ in sorted_recommendations:
        p = get_product_info(pid)
        if p:
            result.append(p)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
