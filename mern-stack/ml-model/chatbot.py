# chatbot.py
from flask import Blueprint, request, jsonify
from flask_cors import CORS, cross_origin
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
CORS(chatbot_api, supports_credentials=True, resources={r"/*": {"origins": ["http://localhost:4200"]}})

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

@chatbot_api.route("/chat", methods=["POST", "OPTIONS"])
@cross_origin(origins="http://localhost:4200", supports_credentials=True)
def chat():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight OK"}), 200

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


# 1. Công nghệ và thư viện sử dụng
# Flask: Framework web Python nhẹ, dùng để tạo API REST.

# Blueprint: để tạo module API tách biệt.

# request: lấy dữ liệu gửi lên từ client.

# jsonify: trả về dữ liệu JSON.

# Flask-CORS: để xử lý Cross-Origin Resource Sharing, cho phép frontend (ở localhost:4200) gọi API mà không bị chặn.

# CORS, cross_origin: cấu hình CORS cho route và blueprint.

# python-dotenv (load_dotenv): đọc biến môi trường từ file .env.

# pymongo: thư viện Python để kết nối và thao tác với MongoDB.

# MongoClient: để kết nối database MongoDB.

# google.generativeai: thư viện SDK (do Google cung cấp) để gọi API mô hình AI Gemini (tương tự ChatGPT).

# genai.configure(api_key=...): cấu hình API key.

# GenerativeModel: khởi tạo mô hình Gemini.

# 2. Các phương thức chính trong đoạn code
# load_dotenv(): nạp các biến môi trường trong file .env vào biến môi trường của hệ thống.

# MongoClient(mongo_uri): tạo client kết nối tới MongoDB.

# products = db["products"]: lấy collection "products" trong database "test".

# build_product_context(): hàm tự định nghĩa

# Truy vấn danh sách sản phẩm chưa bị xóa (is_deleted=False).

# Lấy tên, giá, giảm giá, mô tả của từng sản phẩm.

# Tạo thành chuỗi thông tin các sản phẩm để đưa vào prompt cho AI.

# chatbot_api = Blueprint(...): tạo 1 nhóm route API, có thể dễ dàng import vào app Flask chính.

# CORS(chatbot_api, ...): cấu hình cho phép CORS với frontend tại http://localhost:4200.

# @chatbot_api.route("/chat", methods=["POST", "OPTIONS"]): định nghĩa API POST /chat cho chatbot.

# @cross_origin(...): cho phép CORS riêng cho route này.

# Trong hàm chat():

# Xử lý OPTIONS method (preflight CORS).

# Lấy JSON gửi lên, trích prompt.

# Nếu prompt trống, trả về lỗi.

# Tạo prompt đầy đủ: kết hợp thông tin cửa hàng + danh sách sản phẩm + câu hỏi người dùng.

# Gọi model.generate_content(full_prompt) để gửi prompt lên Gemini AI.

# Lấy câu trả lời (response.text) trả về cho client.

# Bắt lỗi và trả về thông báo lỗi nếu có.

# 3. Giải thích cách hoạt động tổng quan
# Khi server Flask khởi động, nó:

# Đọc API key Gemini và MongoDB URI từ biến môi trường.

# Kết nối MongoDB, truy xuất dữ liệu sản phẩm chưa xóa.

# Tạo product_context — một đoạn văn bản mô tả tất cả sản phẩm hiện có, dùng để nhúng vào prompt cho AI.

# Cấu hình CORS cho phép frontend Angular (chạy trên localhost:4200) gọi API này.

# Khi frontend gửi yêu cầu POST tới /chat với JSON có key "prompt" chứa câu hỏi khách hàng:

# Server sẽ ghép nối system_prompt + product_context + câu hỏi để tạo prompt hoàn chỉnh gửi cho AI Gemini.

# Gọi API Gemini để tạo câu trả lời dựa trên prompt đó.

# Trả kết quả (text) từ AI về cho frontend dưới dạng JSON.

# Nếu có lỗi (prompt rỗng, lỗi API, lỗi kết nối DB...), server sẽ trả lỗi dạng JSON để frontend xử lý.