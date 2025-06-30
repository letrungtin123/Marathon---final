# chatbot.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import os
import google.generativeai as genai
from dotenv import load_dotenv
from pymongo import MongoClient

# === Load biến môi trường
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
mongo_uri = os.getenv("MONGO_URI")

if not api_key or not mongo_uri:
    raise Exception("❌ Missing GEMINI_API_KEY or MONGO_URI")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("models/gemini-1.5-flash")

# === Kết nối MongoDB
client = MongoClient(mongo_uri)
db = client["test"]
products = db["products"]

# === Tạo blueprint
chatbot_api = Blueprint("chatbot_api", __name__)

# === System prompt
system_prompt = (
    "Bạn là nhân viên tư vấn của cửa hàng hoa Dash Stack. "
    "Bạn luôn trả lời chính xác, lịch sự và dễ hiểu. "
    "Dưới đây là thông tin cửa hàng:\n"
    "- Tên: Dash Stack\n"
    "- Giới thiệu: Cửa hàng chuyên cung cấp hoa nghệ thuật cho dịp lễ, cưới hỏi, sự kiện.\n"
    "- Chủ cửa hàng: Tín Lê đẹp trai\n"
    "- Địa chỉ: HUFLIT Hóc Môn\n"
    "- Giờ mở cửa: 8:00 – 22:00\n"
    "- Hotline: 0773 715 827\n"
    "- Website: https://dashstack.vn\n"
    "- Chính sách: Đổi trả trong 7 ngày, giao hàng toàn quốc.\n\n"
    "Dưới đây là danh sách sản phẩm hiện có:\n"
)

# === Lấy thông tin sản phẩm từ MongoDB
def build_product_context():
    context_lines = []
    for p in products.find({"is_deleted": False}):
        name = p.get("nameProduct", "Tên không rõ")
        price = p.get("price", 0)
        sale = p.get("sale", 0)
        desc = p.get("desc", "Không có mô tả")

        if sale > 0:
            new_price = price - sale
            price_info = f"Giá gốc {price}₫, giảm {sale}₫ → còn {new_price}₫"
        else:
            price_info = f"Giá: {price}₫"

        context_lines.append(f"- {name}: {price_info}. Mô tả: {desc}")
    return "\n".join(context_lines)

product_context = build_product_context()

@chatbot_api.route("/chat", methods=["POST"])
@cross_origin(origins="http://localhost:4200", supports_credentials=True)
def chat():
    try:
        data = request.get_json()
        prompt = data.get("prompt", "").strip()

        if not prompt:
            return jsonify({"response": "❌ Prompt rỗng"}), 400

        full_prompt = f"{system_prompt}\n{product_context}\n\nCâu hỏi: {prompt}"

        response = model.generate_content(full_prompt)

        reply = getattr(response, "text", None)
        if not reply:
            return jsonify({"response": "❌ Không có phản hồi từ Gemini."}), 500

        return jsonify({"response": reply})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"response": f"❌ Lỗi chatbot: {str(e)}"}), 500
