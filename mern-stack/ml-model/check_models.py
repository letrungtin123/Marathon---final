# check_models.py
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

print("📦 Danh sách model bạn có quyền truy cập:")
models = genai.list_models()

for model in models:
    model_name = model.name
    is_enabled = model.supported_generation_methods
    print(f"🔹 {model_name} | methods: {is_enabled}")
