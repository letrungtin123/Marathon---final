import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from bson import ObjectId
import random
import numpy as np

# MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['marathon']
orders = list(db['orders'].find())
products = db['products']

# Tách đơn hàng theo user
orders_by_user = {}
for order in orders:
    uid = str(order["userId"])
    orders_by_user.setdefault(uid, []).append(order)

# Chia train/test
train_data = []
test_data = []

for uid, user_orders in orders_by_user.items():
    if len(user_orders) < 2:
        train_data.extend(user_orders)
    else:
        random.shuffle(user_orders)
        split = int(len(user_orders) * 0.8)
        train_data.extend(user_orders[:split])
        test_data.extend(user_orders[split:])

# Tạo user-product matrix từ train
def get_user_product_matrix(data):
    rows = []
    for order in data:
        uid = str(order["userId"])
        for p in order["products"]:
            pid = str(p["productId"])
            rows.append((uid, pid))
    df = pd.DataFrame(rows, columns=["user", "product"])
    return pd.crosstab(df["user"], df["product"])

train_matrix = get_user_product_matrix(train_data)

# Hàm gợi ý cho 1 user
def recommend_for_user(user_id, matrix, k=5):
    if user_id not in matrix.index:
        return []

    sim = cosine_similarity(matrix)
    sim_df = pd.DataFrame(sim, index=matrix.index, columns=matrix.index)

    similar_users = sim_df[user_id].sort_values(ascending=False)[1:4]
    recommendations = {}

    for sim_user in similar_users.index:
        user_products = matrix.loc[sim_user]
        for pid, bought in user_products.items():
            if bought > 0 and matrix.loc[user_id][pid] == 0:
                recommendations[pid] = recommendations.get(pid, 0) + bought

    sorted_recommend = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)[:k]
    return [pid for pid, _ in sorted_recommend]

# Đánh giá precision@k
def precision_at_k(user_id, k=5):
    recommended = recommend_for_user(user_id, train_matrix, k)
    if not recommended:
        return None

    purchased_in_test = set()
    for o in test_data:
        if str(o["userId"]) == user_id:
            for p in o["products"]:
                purchased_in_test.add(str(p["productId"]))

    if not purchased_in_test:
        return None

    hits = set(recommended).intersection(purchased_in_test)
    precision = len(hits) / k
    return precision

# Tính avg precision trên tất cả user
def evaluate_all(k=5):
    user_ids = list(train_matrix.index)
    results = []

    for uid in user_ids:
        p = precision_at_k(uid, k)
        if p is not None:
            results.append(p)

    avg_precision = np.mean(results) if results else 0
    print(f"🎯 Average Precision@{k}: {avg_precision:.4f} (Trên {len(results)} người dùng có dữ liệu test)")
    return avg_precision

if __name__ == "__main__":
    print("🚀 Đánh giá hệ thống gợi ý...")
    evaluate_all(k=5)
