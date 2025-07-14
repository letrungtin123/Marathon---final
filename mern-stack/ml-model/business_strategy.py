import json
from datetime import datetime

# Hàm phân tích chiến lược kinh doanh
def generate_business_strategy(forecast_result, top_selling_result, market_data):
    strategy = {}

    # Phân tích các yếu tố từ dữ liệu thị trường
    market_trends = market_data.get("market_trends", "Thị trường hiện tại có dấu hiệu phục hồi")
    consumer_sentiment = market_data.get("consumer_sentiment", "Tích cực")

    # 1. Đưa ra chiến lược về sản phẩm bán chạy
    top_selling_products = [product["productId"] for product in top_selling_result]
    forecasted_products = [product["productId"] for product in forecast_result]

    target_products = set(top_selling_products).intersection(forecasted_products)
    strategy["target_products"] = list(target_products)

    # 2. Đưa ra chiến lược về doanh thu
    if consumer_sentiment == "Tích cực":
        strategy["revenue_strategy"] = "Tăng cường marketing và mở rộng kênh phân phối"
    else:
        strategy["revenue_strategy"] = "Cần giảm giá và khuyến mãi để kích thích người tiêu dùng"

    # 3. Phân tích thị trường
    strategy["market_trend"] = market_trends

    return strategy

# Đọc dữ liệu thị trường từ file hoặc API
market_data = {
    "market_trends": "Thị trường tiêu dùng tại Việt Nam đang phục hồi nhanh chóng.",
    "consumer_sentiment": "Tích cực"
}

# Tạo chiến lược kinh doanh
strategy = generate_business_strategy(forecast_result, top_selling_result, market_data)

# Xuất ra file chiến lược
try:
    with open("business_strategy.json", "w", encoding="utf-8") as f:
        json.dump(strategy, f, ensure_ascii=False, indent=4)
    print("Chiến lược kinh doanh đã được tạo thành công và lưu vào 'business_strategy.json'.")
except Exception as e:
    print(f"Đã xảy ra lỗi khi lưu file: {e}")