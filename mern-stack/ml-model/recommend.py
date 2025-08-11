# recommend.py
import pandas as pd
from flask import Flask, jsonify
from pymongo import MongoClient
from tensorflow.keras.models import load_model
import numpy as np
import joblib
from bson.objectid import ObjectId

app = Flask(__name__)

# DB
client = MongoClient("mongodb://localhost:27017/")
db = client["marathon"]
orders = db["orders"]
products = db["products"]

# Load model và encoders
model = load_model("recommendation_model.h5")
user_encoder = joblib.load("user_encoder.pkl")
product_encoder = joblib.load("product_encoder.pkl")
all_product_ids = list(product_encoder.classes_)

@app.route('/recommend/<user_id>', methods=["GET"])
def recommend_deep(user_id):
    try:
        user_encoded = user_encoder.transform([user_id])[0]
    except:
        return jsonify([])

    product_encoded = product_encoder.transform(all_product_ids)
    user_ids = np.full(len(product_encoded), user_encoded)

    predictions = model.predict([user_ids, product_encoded], verbose=0).flatten()
    top_indices = predictions.argsort()[::-1][:5]
    top_product_ids = [all_product_ids[i] for i in top_indices]

    result = []
    for pid in top_product_ids:
        product = products.find_one({"_id": ObjectId(pid)})
        if product:
            result.append({
                "_id": str(product["_id"]),
                "name": product.get("nameProduct", ""),
                "price": product.get("price", 0),
                "image": product.get("images", [{}])[0].get("url", "")
            })
    return jsonify(result)

@app.route('/popular', methods=["GET"])
def popular_products():
    product_sales = {}
    for order in orders.find():
        for product in order["products"]:
            pid = str(product["productId"])
            product_sales[pid] = product_sales.get(pid, 0) + product["quantity"]

    top = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)[:5]
    results = []
    for pid, _ in top:
        product = products.find_one({"_id": ObjectId(pid)})
        if product:
            results.append({
                "_id": str(product["_id"]),
                "name": product.get("nameProduct", ""),
                "price": product.get("price", 0),
                "image": product.get("images", [{}])[0].get("url", "")
            })
    return jsonify(results)

if __name__ == '__main__':
    app.run(port=5000)

# recommend.py
# Công nghệ, thư viện
# Flask: tạo API REST.

# pymongo: truy xuất MongoDB.

# tensorflow.keras: load mô hình DL đã train.

# joblib: load encoder.

# numpy: xử lý mảng.

# Chức năng
# API GET /recommend/<user_id>:

# Mã hóa user_id.

# Dự đoán điểm tương tác cho tất cả products.

# Lấy 5 sản phẩm dự đoán cao nhất trả về.

# API GET /popular:

# Tính tổng lượng bán theo từng sản phẩm từ đơn hàng.

# Trả về 5 sản phẩm bán chạy nhất.