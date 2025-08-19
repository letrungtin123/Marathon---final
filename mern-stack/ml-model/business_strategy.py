#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
market_forecast_strategy_prophet.py

Pipeline: Google Trends + Shopee stats + Prophet time-series forecast + weighted scoring
để tạo chiến lược sản phẩm có dữ liệu thật.
- Dùng Prophet để dự báo (time-series) theo từng sản phẩm.
- Kết hợp 3 tín hiệu: tăng trưởng dự báo (forecast), mức quan tâm online (Trends),
  và tính mùa vụ (seasonality) → điểm số tổng hợp.
- Xuất ra strategy_forecast.json.

Cài đặt:
    pip install pandas requests pytrends prophet

Ghi chú:
- Google Trends & Shopee cần internet.
- Shopee có thể 403; cần thay Cookie thật trong header nếu cần.
- Thay dữ liệu bán hàng thật (sales_df) theo cột: date, productId, qty.
"""

import json
from datetime import datetime, timedelta, date
from statistics import mean
from typing import Dict, List, Optional

import numpy as np
import pandas as pd
import requests

# Prophet (tên gói mới là 'prophet'; fallback 'fbprophet' cho môi trường cũ)
try:
    from prophet import Prophet
except Exception:
    from fbprophet import Prophet  # type: ignore

from pytrends.request import TrendReq


# ---------------------------
# Google Trends
# ---------------------------
def fetch_google_trends(keywords: List[str], timeframe: str = "today 12-m", geo: str = "VN") -> dict:
    """Lấy interest_over_time & rising queries cho danh sách từ khóa via pytrends."""
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

        if iot is None or iot.empty:
            return result

        # Nếu điểm cuối là partial thì bỏ để tránh nhiễu
        if "isPartial" in iot.columns and bool(iot["isPartial"].iloc[-1]):
            iot = iot.iloc[:-1]

        for kw in keywords:
            if kw in iot.columns:
                series = iot[kw].astype(float)

                # Timestamp -> str
                series_dict = {ts.strftime("%Y-%m-%d"): float(val) for ts, val in series.items()}
                result["interest_over_time"][kw] = series_dict
                result["avg_interest"][kw] = round(series.mean(), 2)

                # % thay đổi: trung bình 30 điểm gần nhất so với 30 điểm trước đó
                if len(series) >= 60:
                    last_30 = series[-30:].mean()
                    prev_30 = series[-60:-30].mean()
                    if prev_30 == 0:
                        pct = None
                    else:
                        pct = (last_30 - prev_30) / prev_30 * 100.0
                    result["trend_change_pct"][kw] = None if pct is None else round(pct, 2)
                else:
                    result["trend_change_pct"][kw] = None

        # Gọi 1 lần cho toàn bộ từ khóa
        rq_all = pytrends.related_queries()
        for kw in keywords:
            rising_df = None
            if isinstance(rq_all, dict) and kw in rq_all and isinstance(rq_all[kw], dict):
                rising_df = rq_all[kw].get("rising")

            top_rising = []
            if isinstance(rising_df, pd.DataFrame) and not rising_df.empty:
                for _, row in rising_df.head(10).iterrows():
                    val = row.get("value", 0)
                    if isinstance(val, str) and str(val).lower() == "breakout":
                        val_num = 999
                    else:
                        try:
                            val_num = int(val or 0)
                        except Exception:
                            val_num = 0
                    top_rising.append((row.get("query"), val_num))
            result["top_rising_queries"][kw] = top_rising

    except Exception as e:
        print(f"[fetch_google_trends] Error: {e}")

    return result


# ---------------------------
# Shopee (best-effort; endpoint không chính thức)
# ---------------------------
def fetch_shopee_for_keyword(keyword: str, limit: int = 50, timeout: int = 8) -> dict:
    url = "https://shopee.vn/api/v4/search/search_items"
    params = {"by": "pop", "limit": limit, "order": "desc", "keyword": keyword}
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
        ),
        "Accept": "application/json, text/plain, */*",
        # Thay cookie thật từ trình duyệt của bạn nếu bị 403
        "Cookie": "SPC_ST=FAKE_COOKIE_VALUE"
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
        if resp.status_code == 403:
            print(f"[fetch_shopee_for_keyword] 403 blocked '{keyword}', trả về rỗng.")
            return out
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

            # Shopee thường scale price * 100000
            price_raw = basic.get("price") or basic.get("price_min") or basic.get("price_max")
            price_vnd = price_raw / 100000 if price_raw else None

            sold = basic.get("sold", None)
            if sold is None:
                sold = basic.get("historical_sold", 0)

            shopid = basic.get("shopid")
            products.append({
                "name": basic.get("name"),
                "price_vnd": price_vnd,
                "sold": sold,
                "shopid": shopid,
                "shop_location": basic.get("shop_location")
            })
            if price_vnd:
                prices.append(price_vnd)
            if shopid:
                shop_counts[shopid] = shop_counts.get(shopid, 0) + 1

        out["items_count"] = len(items)
        out["avg_price_vnd"] = round(mean(prices), 0) if prices else None
        out["top_products"] = sorted(products, key=lambda x: (x["sold"] or 0), reverse=True)[:10]
        out["top_shops"] = [{"shopid": sid, "count": cnt}
                            for sid, cnt in sorted(shop_counts.items(), key=lambda x: x[1], reverse=True)[:10]]
    except Exception as e:
        print(f"[fetch_shopee_for_keyword] Error '{keyword}': {e}")

    return out


def fetch_shopee_data(keywords: List[str], per_kw_limit: int = 50) -> dict:
    return {kw: fetch_shopee_for_keyword(kw, limit=per_kw_limit) for kw in keywords}


# ---------------------------
# Seasonality helpers
# ---------------------------
def _second_sunday_of_may(year: int) -> date:
    d = date(year, 5, 1)
    # weekday(): Monday=0 ... Sunday=6
    offset = (6 - d.weekday()) % 7
    first_sun = d + timedelta(days=offset)
    return first_sun + timedelta(days=7)


def seasonality_score(today: Optional[date] = None) -> float:
    """Điểm mùa vụ [0,1] cho ngành hoa VN.
    Đỉnh: Tết (xấp xỉ), 14/2, 8/3, Mother's Day (CN thứ 2 tháng 5), 20/11, mùa cưới 9–3.
    """
    if today is None:
        today = date.today()
    yr = today.year

    valentines = date(yr, 2, 14)
    women_day = date(yr, 3, 8)
    mothers_day = _second_sunday_of_may(yr)
    teachers_day = date(yr, 11, 20)

    # Xấp xỉ Tết: 20/1 → 15/2
    tet_window = (date(yr, 1, 20), date(yr, 2, 15))

    # Mùa cưới: 9→3
    wedding_months = {9, 10, 11, 12, 1, 2, 3}

    score = 0.0

    def bump(peak_date: date, window_days: int = 7, weight: float = 0.25):
        nonlocal score
        if abs((today - peak_date).days) <= window_days:
            score += weight

    # Tết nặng điểm hơn
    if tet_window[0] <= today <= tet_window[1]:
        score += 0.35

    bump(valentines, window_days=5, weight=0.2)
    bump(women_day, window_days=5, weight=0.2)
    bump(mothers_day, window_days=5, weight=0.15)
    bump(teachers_day, window_days=5, weight=0.2)

    if today.month in wedding_months:
        score += 0.15

    return float(min(1.0, score))


# ---------------------------
# Market data tổng hợp
# ---------------------------
def fetch_market_data() -> dict:
    keywords = ["hoa tươi", "hoa cưới", "hoa nhập khẩu", "hoa giá rẻ", "shop hoa online"]
    gt = fetch_google_trends(keywords)
    shopee_stats = fetch_shopee_data(["hoa", "hoa tươi", "hoa cưới"])

    hoa_interest = gt["avg_interest"].get("hoa tươi")
    interest_text = f"chỉ số quan tâm ~{hoa_interest}" if hoa_interest else "mức quan tâm online trung bình"

    distribution_channels = [
        "Chợ hoa đầu mối", "Cửa hàng hoa tươi",
        "Dịch vụ điện hoa", "Website/App", "Mạng xã hội", "Sàn TMĐT"
    ]

    xu_huong = []
    for kw, rising in gt.get("top_rising_queries", {}).items():
        for q, _ in (rising or [])[:3]:
            if q and q not in xu_huong:
                xu_huong.append(q)
    xu_huong += ["Hoa nhập khẩu cao cấp", "Giao nhanh 2-4h", "Hoa concept cá nhân hóa", "Hoa bảo quản lâu"]

    peak_seasons = ["Tết Nguyên Đán", "14/2", "8/3", "Ngày của Mẹ", "20/11", "Mùa cưới 9-3"]

    competitors = ["Dalat Hasfarm", "Flower Box", "Liti Florist", "Gấu Con Flowers"]

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
        "consumer_sentiment": "Tích cực",  # có thể tính từ review/news nếu mở rộng
        "last_checked": datetime.utcnow().isoformat() + "Z"
    }


# ---------------------------
# Prophet forecasting
# ---------------------------
def train_prophet_per_product(sales_df: pd.DataFrame, periods: int = 30, freq: str = 'D') -> List[dict]:
    """Huấn luyện Prophet cho từng product và trả về forecast + tăng trưởng.
    sales_df cột: ['date', 'productId', 'qty']
    Return: list dict: productId, forecast_next_period_sum, last_period_sum, forecast_growth_pct
    """
    required = {"date", "productId", "qty"}
    if not required.issubset(set(sales_df.columns)):
        raise ValueError("sales_df cần các cột: date, productId, qty")

    df = sales_df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values(["productId", "date"])

    horizon = periods
    results = []

    for pid, grp in df.groupby("productId"):
        # Tổng theo ngày
        daily = grp.groupby("date", as_index=False)["qty"].sum()
        daily = daily.rename(columns={"date": "ds", "qty": "y"})

        if len(daily) < 10:
            results.append({
                "productId": pid,
                "status": "insufficient_data",
                "forecast_next_period_sum": None,
                "last_period_sum": None,
                "forecast_growth_pct": None
            })
            continue

        m = Prophet(growth='linear', yearly_seasonality=True, weekly_seasonality=True, daily_seasonality=False)
        m.fit(daily)

        future = m.make_future_dataframe(periods=horizon, freq=freq, include_history=True)
        fcst = m.predict(future)

        history_end = daily["ds"].max()
        hist_window_start = history_end - pd.Timedelta(days=horizon - 1)

        last_hist = fcst[(fcst["ds"] >= hist_window_start) & (fcst["ds"] <= history_end)]
        next_window_start = history_end + pd.Timedelta(days=1)
        next_window_end = history_end + pd.Timedelta(days=horizon)
        next_fcst = fcst[(fcst["ds"] >= next_window_start) & (fcst["ds"] <= next_window_end)]

        last_sum = float(daily[(daily["ds"] >= hist_window_start) & (daily["ds"] <= history_end)]["y"].sum())
        next_sum = float(next_fcst["yhat"].sum()) if not next_fcst.empty else None

        growth_pct = None
        if next_sum is not None and last_sum > 0:
            growth_pct = (next_sum - last_sum) / last_sum * 100.0

        results.append({
            "productId": pid,
            "status": "ok",
            "forecast_next_period_sum": None if next_sum is None else round(next_sum, 2),
            "last_period_sum": round(last_sum, 2),
            "forecast_growth_pct": None if growth_pct is None else round(growth_pct, 2)
        })

    return results


# ---------------------------
# Weighted scoring
# ---------------------------
def minmax_scale(values: List[Optional[float]]) -> List[float]:
    """Scale [0,1], bỏ qua None (None → 0)."""
    clean = [v for v in values if v is not None]
    if not clean:
        return [0.0 for _ in values]
    vmin, vmax = min(clean), max(clean)
    if vmin == vmax:
        return [0.5 if v is not None else 0.0 for v in values]

    def _s(v):
        if v is None:
            return 0.0
        return (v - vmin) / (vmax - vmin)

    return [_s(v) for v in values]


def compute_weighted_scores(
    product_ids: List[str],
    forecast_result: List[dict],
    trends: dict,
    product_kw_map: Optional[Dict[str, str]] = None,
    w_forecast: float = 0.5,
    w_trend: float = 0.3,
    w_season: float = 0.2,
    today: Optional[date] = None
) -> List[dict]:
    """Ghép forecast growth + Trends avg_interest + seasonality thành 1 điểm cho mỗi sản phẩm."""
    if today is None:
        today = date.today()

    # 1) Forecast growth theo product
    growth_map = {d["productId"]: d.get("forecast_growth_pct") for d in forecast_result}
    growth_list = [growth_map.get(pid) for pid in product_ids]
    growth_scaled = minmax_scale(growth_list)

    # 2) Trend interest map theo từ khóa của từng product
    kw_map = product_kw_map or {}
    avg_interest = trends.get("avg_interest", {})
    trend_vals = []
    for pid in product_ids:
        kw = kw_map.get(pid)
        val = avg_interest.get(kw) if kw else None
        trend_vals.append(val if isinstance(val, (int, float)) else None)
    trend_scaled = minmax_scale(trend_vals)

    # 3) Seasonality — cùng giá trị cho mọi sản phẩm (yếu tố ngành)
    season = seasonality_score(today=today)

    # 4) Tính điểm
    scores = []
    for i, pid in enumerate(product_ids):
        s = w_forecast * growth_scaled[i] + w_trend * trend_scaled[i] + w_season * season
        scores.append({
            "productId": pid,
            "forecast_growth_pct": growth_list[i],
            "trend_avg_interest": trend_vals[i],
            "seasonality": round(season, 3),
            "score": round(float(s), 4)
        })
    scores.sort(key=lambda x: x["score"], reverse=True)
    return scores


# ---------------------------
# Generate strategy
# ---------------------------
def generate_business_strategy(
    forecast_result: List[dict],
    top_selling_result: List[dict],
    market_data: dict,
    weighted_scores: List[dict]
) -> dict:
    market_trends = market_data.get("market_trends", {})
    consumer_sentiment = market_data.get("consumer_sentiment", "Tích cực")

    # Target = giao giữa top-selling và product có forecast hợp lệ
    top_selling_products = [p["productId"] for p in top_selling_result]
    forecasted_products = [p["productId"] for p in forecast_result if p.get("status") == "ok"]
    target_products = sorted(set(top_selling_products).intersection(forecasted_products))

    revenue_strategy = (
        "Tăng cường marketing online và mở rộng kênh TMĐT"
        if consumer_sentiment == "Tích cực"
        else "Tăng khuyến mãi để kích cầu"
    )

    recommendations = weighted_scores[:5]

    plan = [
        "Ưu tiên nguồn lực cho các sản phẩm có điểm tổng hợp cao nhất (Top 3–5).",
        "Tối ưu danh sách/từ khóa SEO bám theo các Rising Queries từ Google Trends.",
        "Chuẩn bị gói khuyến mãi theo mùa (Tết, 14/2, 8/3, 20/11) trước 2–3 tuần.",
        "Mở rộng kênh bán (TMĐT, website, MXH) cho nhóm sản phẩm đang tăng trưởng dự báo."
    ]

    strategy = {
        "target_products": target_products,
        "revenue_strategy": revenue_strategy,
        "market_trend": market_trends,
        "recommendations": recommendations,
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "notes": plan
    }
    return strategy


# ---------------------------
# Example main
# ---------------------------
if __name__ == "__main__":
    # === 1) Ví dụ dữ liệu bán (thay bằng dữ liệu thật của bạn) ===
    # Tạo dữ liệu giả cho 3 sản phẩm P001,P002,P003 (120 ngày)
    rng = pd.date_range(end=pd.Timestamp.today().normalize(), periods=120, freq="D")
    toy = []
    for i, pid in enumerate(["P001", "P002", "P003"]):
        base = 10 + i * 5
        trend = (pd.Series(range(len(rng))) / 120.0) * (5 * (i + 1))  # xu hướng tăng nhẹ
        season = 3 * pd.Series([1 if d.month in [9, 10, 11, 12, 1, 2, 3] else 0 for d in rng])
        noise = pd.Series(np.random.randn(len(rng))).clip(lower=-2)
        qty = (base + trend + season + noise).round().astype(int)
        qty = qty.clip(lower=0)
        tmp = pd.DataFrame({"date": rng, "productId": pid, "qty": qty})
        toy.append(tmp)
    sales_df = pd.concat(toy, ignore_index=True)

    # === 2) Dự báo với Prophet ===
    forecast_result = train_prophet_per_product(sales_df, periods=30, freq='D')

    # === 3) Top-selling sample (thay bằng dữ liệu tổng hợp thật) ===
    top_selling_result = [
        {"productId": "P001", "bought_count": 320},
        {"productId": "P003", "bought_count": 150},
        {"productId": "P002", "bought_count": 120},
    ]

    # === 4) Market data (Google Trends + Shopee) ===
    market_data = fetch_market_data()
    trends_raw = market_data["market_trends"]["google_trends_raw"]

    # Map product → keyword để lấy tín hiệu Trends
    product_kw_map = {"P001": "hoa tươi", "P002": "hoa cưới", "P003": "hoa nhập khẩu"}

    # === 5) Tính điểm có trọng số ===
    product_ids = [r["productId"] for r in forecast_result]
    weighted_scores = compute_weighted_scores(
        product_ids=product_ids,
        forecast_result=forecast_result,
        trends=trends_raw,
        product_kw_map=product_kw_map,
        w_forecast=0.5, w_trend=0.3, w_season=0.2
    )

    # === 6) Chiến lược ===
    strategy = generate_business_strategy(
        forecast_result=forecast_result,
        top_selling_result=top_selling_result,
        market_data=market_data,
        weighted_scores=weighted_scores
    )

    # === 7) Lưu kết quả ===
    out = {
        "forecast_result": forecast_result,
        "weighted_scores": weighted_scores,
        "strategy": strategy
    }
    with open("strategy_forecast.json", "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print("Saved strategy_forecast.json")
