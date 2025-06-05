import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from pymongo import MongoClient
import numpy as np

app = Flask(__name__)

client = MongoClient("mongodb://localhost:27017/")
db = client['marathon']
orders = db['orders']
products = db['products']

def get_user_product_matrix():
    data = []
    for order in orders.find():
        user = str(order["userId"])
        for product in order["products"]:
            product_id = str(product["productId"])
            data.append((user, product_id))

    df = pd.DataFrame(data, columns=["user", "product"])
    user_product_matrix = pd.crosstab(df["user"], df["product"])
    return user_product_matrix

@app.route('/recommend/<user_id>', methods=["GET"])
def recommend_for_user(user_id):
    matrix = get_user_product_matrix()
    if user_id not in matrix.index:
        return jsonify([])

    sim = cosine_similarity(matrix)
    sim_df = pd.DataFrame(sim, index=matrix.index, columns=matrix.index)
    similar_users = sim_df[user_id].sort_values(ascending=False)[1:4]  # Top 3 similar users

    recommendations = {}
    for sim_user in similar_users.index:
        user_products = matrix.loc[sim_user]
        for product_id, bought in user_products.items():
            if bought > 0 and matrix.loc[user_id][product_id] == 0:
                recommendations[product_id] = recommendations.get(product_id, 0) + bought

    sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:5]

    product_info = [products.find_one({"_id": ObjectId(pid)}) for pid, _ in sorted_recommendations]
    results = [{"_id": str(p["_id"]), "name": p["nameProduct"], "price": p["price"], "image": p["images"][0]["url"]} for p in product_info if p]

    return jsonify(results)

@app.route('/popular', methods=["GET"])
def popular_products():
    product_sales = {}
    for order in orders.find():
        for product in order["products"]:
            pid = str(product["productId"])
            product_sales[pid] = product_sales.get(pid, 0) + product["quantity"]

    top = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)[:5]
    product_info = [products.find_one({"_id": ObjectId(pid)}) for pid, _ in top]
    results = [{"_id": str(p["_id"]), "name": p["nameProduct"], "price": p["price"], "image": p["images"][0]["url"]} for p in product_info if p]

    return jsonify(results)

if __name__ == '__main__':
    app.run(port=5000)
