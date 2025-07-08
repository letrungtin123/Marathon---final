# train_lead_prediction.py
import os
import pandas as pd
from pymongo import MongoClient
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# Load biến môi trường
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["test"]
orders = db["orders"]
users = db["users"]

# Load dữ liệu người dùng (chỉ lấy khách hàng)
user_cursor = users.find({"role": "customer"})
user_data = []
for user in user_cursor:
    user_data.append({
        "user_id": str(user["_id"]),
        "email": user.get("email", ""),
        "address": user.get("address", ""),
        "phone": user.get("phone", ""),
        "created_at": user.get("createdAt"),
        "updated_at": user.get("updatedAt"),
    })
user_df = pd.DataFrame(user_data)

# Load đơn hàng và tính số lượng đơn theo từng user
order_cursor = orders.find()
order_data = []
for order in order_cursor:
    uid = str(order.get("userId"))
    created_at = order.get("createdAt")
    total = order.get("total", 0)
    order_data.append({
        "user_id": uid,
        "total": total,
        "created_at": created_at,
    })
order_df = pd.DataFrame(order_data)

# Tính các đặc trưng đơn giản
agg_orders = order_df.groupby("user_id").agg({
    "total": ["sum", "count"],
    "created_at": "max"
}).reset_index()
agg_orders.columns = ["user_id", "total_spent", "order_count", "last_order_date"]

# Merge lại
df = pd.merge(user_df, agg_orders, how="left", on="user_id").fillna({
    "total_spent": 0,
    "order_count": 0
})

# Tạo nhãn: khách hàng tiềm năng = đã từng mua >= 1 lần
df["potential"] = (df["order_count"] >= 1).astype(int)

# Tiền xử lý dữ liệu
df["created_at"] = pd.to_datetime(df["created_at"])
df["account_age_days"] = (pd.Timestamp.now() - df["created_at"]).dt.days

# Các đặc trưng đầu vào
features = ["total_spent", "order_count", "account_age_days"]
X = df[features]
y = df["potential"]

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Đánh giá mô hình
print("Evaluation Report:")
print(classification_report(y_test, clf.predict(X_test)))

# Lưu mô hình
joblib.dump(clf, "lead_model.pkl")
print("✅ Model saved as lead_model.pkl")
