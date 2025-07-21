# Embedding + Deep Learning


# train_recommendation_model.py
import pandas as pd
import numpy as np
from pymongo import MongoClient
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Embedding, Flatten, Dense, Concatenate
from tensorflow.keras.optimizers import Adam
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from dotenv import load_dotenv

# Load biến môi trường từ .env (chứa MONGO_URI)
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")

if not mongo_uri:
    raise Exception("❌ MONGO_URI not found in .env")

# Kết nối MongoDB và lấy collection orders
client = MongoClient(mongo_uri)
db = client["test"]
orders = db["orders"]

# Trích xuất dữ liệu user-product-quantity từ đơn hàng
data = []
for order in orders.find():
    user_raw = order.get("userId")
    if not user_raw:
        continue

    user = str(user_raw["$oid"]) if isinstance(user_raw, dict) else str(user_raw)

    for p in order.get("products", []):
        product_raw = p.get("productId")
        if not product_raw:
            continue
        product = str(product_raw["$oid"]) if isinstance(product_raw, dict) else str(product_raw)
        quantity = p.get("quantity", 1)
        data.append((user, product, quantity))

# Chuyển thành DataFrame
df = pd.DataFrame(data, columns=["user", "product", "quantity"])

if df.empty:
    sample = orders.find_one()
    print("🧪 order sample:", sample)
    raise Exception("❌ Không có dữ liệu đơn hàng để huấn luyện!")

# Encode user & product IDs
user_encoder = LabelEncoder()
product_encoder = LabelEncoder()

df["user_id"] = user_encoder.fit_transform(df["user"])
df["product_id"] = product_encoder.fit_transform(df["product"])
df["interaction"] = df["quantity"]

# Lưu lại encoder
joblib.dump(user_encoder, "user_encoder.pkl")
joblib.dump(product_encoder, "product_encoder.pkl")

# Số lượng unique users và products
n_users = df["user_id"].nunique()
n_products = df["product_id"].nunique()

# Xây dựng mô hình Deep Learning đơn giản
user_input = Input(shape=(1,))
product_input = Input(shape=(1,))
user_embedding = Embedding(input_dim=n_users, output_dim=50)(user_input)
product_embedding = Embedding(input_dim=n_products, output_dim=50)(product_input)

user_vec = Flatten()(user_embedding)
product_vec = Flatten()(product_embedding)
concat = Concatenate()([user_vec, product_vec])
dense1 = Dense(128, activation="relu")(concat)
dense2 = Dense(64, activation="relu")(dense1)
output = Dense(1)(dense2)

model = Model(inputs=[user_input, product_input], outputs=output)
model.compile(optimizer=Adam(0.001), loss="mse")

# Huấn luyện mô hình
model.fit(
    [df["user_id"], df["product_id"]],
    df["interaction"],
    epochs=10,
    batch_size=32,
    validation_split=0.1
)

# Lưu mô hình
model.save("recommendation_model.h5")
print("✅ Đã huấn luyện xong mô hình và lưu vào recommendation_model.h5")
