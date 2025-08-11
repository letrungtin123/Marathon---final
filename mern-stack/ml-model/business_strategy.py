import json
import time
from datetime import datetime
from statistics import mean
import requests
import pandas as pd
from pytrends.request import TrendReq

# ---------------------------
# Fetch data từ Google Trends
# ---------------------------
def fetch_google_trends(keywords, timeframe="today 12-m", geo="VN"):
    pytrends = TrendReq(hl="vi-VN", tz=420)
    result = {
        "keywords": keywords,
        "interest_over_time": {},
        "avg_interest": {},
        "trend_change_pct": {},
        "top_rising_queries": {}
    }

    try:
        pytrends.build_payload(keywords, timeframe=timeframe, geo=geo)
        iot = pytrends.interest_over_time()

        if iot.empty:
            return result

        for kw in keywords:
            if kw in iot.columns:
                series = iot[kw].astype(float)

                # Chuyển Timestamp -> string YYYY-MM-DD
                series_dict = {ts.strftime("%Y-%m-%d"): float(val) for ts, val in series.items()}
                result["interest_over_time"][kw] = series_dict

                result["avg_interest"][kw] = round(series.mean(), 2)

                if len(series) >= 60:
                    last_30 = series[-30:].mean()
                    prev_30 = series[-60:-30].mean()
                    pct = None if prev_30 == 0 else (last_30 - prev_30) / prev_30 * 100.0
                    result["trend_change_pct"][kw] = None if pct is None else round(pct, 2)
                else:
                    result["trend_change_pct"][kw] = None

                rq = pytrends.related_queries().get(kw, {})
                rising = rq.get("rising") if isinstance(rq, dict) else None
                top_rising = []
                if isinstance(rising, pd.DataFrame):
                    for _, row in rising.head(10).iterrows():
                        top_rising.append((row.get("query"), int(row.get("value", 0))))
                result["top_rising_queries"][kw] = top_rising
    except Exception as e:
        print(f"[fetch_google_trends] Lỗi khi lấy Google Trends: {e}")

    return result


# ---------------------------
# Fetch data từ Shopee (public search)
# ---------------------------
def fetch_shopee_for_keyword(keyword, limit=50, timeout=8):
    url = "https://shopee.vn/api/v4/search/search_items"
    params = {
        "by": "pop",
        "limit": limit,
        "order": "desc",
        "keyword": keyword
    }
    headers = {
        "User-Agent": "Mozilla/5.0 (compatible; business-strategy-bot/1.0)",
        "Accept": "application/json, text/plain, */*"
    }

    out = {
        "keyword": keyword,
        "items_count": 0,
        "avg_price_vnd": None,
        "top_products": [],
        "top_shops": []
    }

    try:
        resp = requests.get(url, params=params, headers=headers, timeout=timeout)
        resp.raise_for_status()
        data = resp.json()
        items = data.get("items") or []
        if not items:
            return out

        prices = []
        products = []
        shop_counts = {}
        for it in items:
            basic = it.get("item_basic") or {}
            name = basic.get("name")
            price_raw = basic.get("price") or basic.get("price_min") or basic.get("price_max")
            price_vnd = price_raw / 100000 if price_raw else None
            sold = basic.get("sold", 0)
            shopid = basic.get("shopid")
            shop_location = basic.get("shop_location")

            products.append({
                "name": name,
                "price_vnd": price_vnd,
                "sold": sold,
                "shopid": shopid,
                "shop_location": shop_location
            })
            if price_vnd:
                prices.append(price_vnd)
            if shopid:
                shop_counts[shopid] = shop_counts.get(shopid, 0) + 1

        out["items_count"] = len(items)
        out["avg_price_vnd"] = round(mean(prices), 0) if prices else None
        out["top_products"] = sorted(products, key=lambda x: x["sold"], reverse=True)[:10]
        out["top_shops"] = [{"shopid": sid, "count": cnt} for sid, cnt in sorted(shop_counts.items(), key=lambda x: x[1], reverse=True)[:10]]
    except Exception as e:
        print(f"[fetch_shopee_for_keyword] Lỗi Shopee cho '{keyword}': {e}")

    return out


def fetch_shopee_data(keywords, per_kw_limit=50):
    summary = {}
    for kw in keywords:
        summary[kw] = fetch_shopee_for_keyword(kw, limit=per_kw_limit)
        time.sleep(0.8)
    return summary


# ---------------------------
# Hàm fetch_market_data chính
# ---------------------------
def fetch_market_data():
    keywords = ["hoa tươi", "hoa cưới", "hoa nhập khẩu", "hoa giá rẻ", "shop hoa online"]

    gt = fetch_google_trends(keywords, timeframe="today 12-m", geo="VN")
    shopee_stats = fetch_shopee_data(["hoa", "hoa tươi", "hoa cưới"], per_kw_limit=50)

    hoa_interest = gt["avg_interest"].get("hoa tươi")
    interest_text = "mức quan tâm online trung bình" if hoa_interest is None else f"chỉ số quan tâm ~{hoa_interest}"

    distribution_channels = [
        "Chợ hoa đầu mối",
        "Cửa hàng hoa tươi",
        "Dịch vụ điện hoa / giao nhanh",
        "Website/App",
        "Mạng xã hội",
        "Sàn TMĐT"
    ]

    xu_huong = []
    for kw, rising in gt.get("top_rising_queries", {}).items():
        for q, _ in rising[:3]:
            if q and q not in xu_huong:
                xu_huong.append(q)
    xu_huong += [
        "Hoa nhập khẩu cao cấp",
        "Giao nhanh 2-4h",
        "Hoa concept cá nhân hóa",
        "Hoa bảo quản lâu"
    ]

    peak_seasons = ["Tết Nguyên Đán", "14/2", "8/3", "Ngày của Mẹ", "20/11", "Mùa cưới 9-3"]

    top_shops_all = {}
    for kw_stat in shopee_stats.values():
        for s in kw_stat.get("top_shops", []):
            top_shops_all[s["shopid"]] = top_shops_all.get(s["shopid"], 0) + s["count"]
    competitors = [f"Shopee shop id {sid} (count={cnt})" for sid, cnt in sorted(top_shops_all.items(), key=lambda x: x[1], reverse=True)[:10]]
    competitors += ["Dalat Hasfarm", "Flower Box", "Liti Florist", "Gấu Con Flowers"]

    opportunities = ["Tăng mua hoa online", "Cá nhân hóa sản phẩm"]
    challenges = ["Cạnh tranh giá trên TMĐT", "Chi phí logistics cao", "Rủi ro bảo quản khi vận chuyển"]

    market_trends_obj = {
        "quy_mo_tiem_nang": f"{interest_text}; Shopee có {sum(v.get('items_count', 0) for v in shopee_stats.values())} sản phẩm liên quan",
        "kenh_phan_phoi": distribution_channels,
        "xu_huong_tieu_dung": xu_huong,
        "mua_vu_cao_diem": peak_seasons,
        "canh_tranh": competitors,
        "co_hoi": opportunities,
        "thach_thuc": challenges,
        "google_trends_raw": gt,
        "shopee_stats_raw": shopee_stats,
        "last_updated": datetime.utcnow().isoformat() + "Z"
    }

    return {
        "market_trends": market_trends_obj,
        "consumer_sentiment": "Tích cực",
        "last_checked": datetime.utcnow().isoformat() + "Z"
    }


# ---------------------------
# Generate strategy
# ---------------------------
def generate_business_strategy(forecast_result, top_selling_result, market_data):
    strategy = {}
    market_trends = market_data.get("market_trends", {})
    consumer_sentiment = market_data.get("consumer_sentiment", "Tích cực")

    top_selling_products = [p["productId"] for p in top_selling_result]
    forecasted_products = [p["productId"] for p in forecast_result]
    target_products = set(top_selling_products).intersection(forecasted_products)
    strategy["target_products"] = list(target_products)

    if consumer_sentiment == "Tích cực":
        strategy["revenue_strategy"] = "Tăng cường marketing online và mở rộng kênh TMĐT"
    else:
        strategy["revenue_strategy"] = "Tăng khuyến mãi để kích cầu"

    strategy["market_trend"] = market_trends
    return strategy


if __name__ == "__main__":
    forecast_result = [{"productId": "P001"}, {"productId": "P002"}]
    top_selling_result = [{"productId": "P001", "bought_count": 320}, {"productId": "P003", "bought_count": 150}]
    market_data = fetch_market_data()
    strategy = generate_business_strategy(forecast_result, top_selling_result, market_data)

    with open("business_strategy.json", "w", encoding="utf-8") as f:
        json.dump(strategy, f, ensure_ascii=False, indent=4)
    print("Đã lưu business_strategy.json")
