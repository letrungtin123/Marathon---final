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
from dotenv import load_dotenv
import joblib

# Load biến môi trường
load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/*": {"origins": ["http://localhost:4200", "http://localhost:3000"]}
})

# Blueprint chatbot
from chatbot import chatbot_api
app.register_blueprint(chatbot_api)

# MongoDB
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri:
    raise Exception("❌ MONGO_URI not found")
client = MongoClient(mongo_uri)
db = client["test"]
orders = db["orders"]
products = db["products"]
users = db["users"]

# Hàm lấy thông tin sản phẩm
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

# Hàm dự đoán
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

    # Tính tổng số lượng bán từng sản phẩm từng tháng
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
        predicted_qty = max(int(round(predicted)), 0)
        forecast.append({
            "productId": pid,
            "predicted_quantity": predicted_qty
        })

    forecast_sorted = sorted(forecast, key=lambda x: x["predicted_quantity"], reverse=True)
    product_freq = df.groupby("productId")["quantity"].sum().sort_values(ascending=False).head(8)
    top_selling = [{"productId": pid, "bought_count": int(qty)} for pid, qty in product_freq.items()]

    print("Top bán chạy:", top_selling)
    print("Dự báo:", forecast_sorted[:8])

    return top_selling, forecast_sorted

# Cache forecast kết quả khi server chạy
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

    print(f"Tổng doanh thu dự báo: {total_revenue}")
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

# Load model khi server khởi động
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
# Fetch thị trường Việt Nam (Dữ liệu từ các nguồn bên ngoài)
def fetch_market_data():
    # Ví dụ: Lấy dữ liệu từ một API hoặc web scraping (dữ liệu thị trường)
    # Giả sử API trả về thông tin về thị trường
    response = requests.get("https://api.example.com/marketdata/vietnam")
    if response.status_code == 200:
        return response.json()  # Giả sử dữ liệu trả về là JSON
    return {}

# Dự báo chiến lược kinh doanh (sử dụng AI)
def run_business_strategy_ai():
    # Giả sử ta đã thu thập dữ liệu từ các API hoặc mạng xã hội
    market_data = fetch_market_data()
    
    # Sử dụng mô hình AI dự đoán chiến lược
    model = joblib.load("business_strategy_model.pkl")
    features = [market_data.get("market_trends"), market_data.get("consumer_sentiment")]
    predicted_strategy = model.predict([features])

    return predicted_strategy

# Cập nhật business strategy API
@app.route("/business-strategy", methods=["GET"])
def business_strategy():
    try:
        # Thu thập dữ liệu thị trường và phân tích bằng mô hình AI
        market_data = fetch_market_data()
        strategy_from_ai = run_business_strategy_ai()

        # Tiến hành tính toán chiến lược
        top_selling_result, forecast_result = run_forecast()

        # Tính toán doanh thu dự báo
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

        # Tính toán chiến lược về doanh thu
        revenue_strategy = strategy_from_ai["revenue_strategy"]  # Lấy từ mô hình AI
        market_trend = strategy_from_ai["market_trend"]  # Lấy từ mô hình AI

        # Trả về chiến lược
        strategy = {
            "target_products": top_selling_result,  # Sử dụng top-selling từ MongoDB
            "revenue_strategy": revenue_strategy,
            "market_trend": market_trend
        }

        return jsonify(strategy)

    except Exception as e:
        return jsonify({"error": f"Không tìm thấy chiến lược kinh doanh. Lỗi: {str(e)}"}), 500




# Cuối cùng, chạy app
if __name__ == "__main__":
    app.run(port=5000, debug=True)


# Phân tích phần train AI:
# Mô hình học máy sử dụng: Mô hình Linear Regression (Hồi quy tuyến tính).

# Dữ liệu huấn luyện: Dữ liệu gồm thông tin về sản phẩm, số lượng bán hàng theo từng tháng. Các cột time (thời gian dạng tháng) và quantity (số lượng bán) được sử dụng làm các đặc trưng (features) và mục tiêu (target).

# Bước train: model.fit(X, y) là nơi mô hình học máy được huấn luyện với dữ liệu thời gian và số lượng bán.

# Mô hình hồi quy tuyến tính này nhằm dự đoán số lượng sản phẩm sẽ bán được trong tháng tiếp theo dựa trên các dữ liệu lịch sử về sản phẩm đó.

# Các bước trong quy trình dự báo:
# Chuẩn bị dữ liệu: Thu thập dữ liệu từ đơn hàng, bao gồm productId, quantity, và thời gian (createdAt).

# Nhóm dữ liệu: Tổng hợp số lượng bán của từng sản phẩm theo từng tháng.

# Huấn luyện mô hình: Sử dụng hồi quy tuyến tính (Linear Regression) để học mối quan hệ giữa thời gian (tháng) và số lượng bán.

# Dự đoán: Dự đoán số lượng bán cho tháng tiếp theo dựa trên mô hình đã huấn luyện.