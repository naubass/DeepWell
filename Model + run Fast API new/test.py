import requests

# ==========================================
# 1. SAMPLE DATA INPUT (FLATTENED V4.0)
# ==========================================

# Andi 🟢 Target: Excellent 
ANDI_PAYLOAD = {
    "age": 16,
    "gender": "male",
    "sleep_hours": 8.0, 
    "stress_level": 1,
    "sleep_disorder_level": 0,
    "daily_social_media_hours": 1.5,
    "platform_usage": "Instagram",
    "screen_time_before_sleep": 0.3,
    "performance": 9.0,
    "physical_activity": 4.0,
    "social_interaction_level": "high",
    "anxiety_level": 1,
    "addiction_level": 1,
    "sleep_quality": 7,
    "occupation": "Engineer",
    "bmi_category": "Normal"
}

# Budi 🟡 Target: Fair
BUDI_PAYLOAD = {
    "age": 25,
    "gender": "male",
    "sleep_hours": 4.5, # Dirata-rata antara mental dan sleep
    "stress_level": 4,
    "sleep_disorder_level": 2,
    "daily_social_media_hours": 8.0,
    "platform_usage": "Both",
    "screen_time_before_sleep": 3.5,
    "performance": 2.0,
    "physical_activity": 0.8,
    "social_interaction_level": "low",
    "anxiety_level": 9,
    "addiction_level": 3,
    "sleep_quality": 5,
    "occupation": "Teacher",
    "bmi_category": "Overweight"
}

# Cici 🔴 Target: Need Attention 
CICI_PAYLOAD = {
    "age": 25,
    "gender": "female",
    "sleep_hours": 4.0, 
    "stress_level": 10,
    "sleep_disorder_level": 2,
    "daily_social_media_hours": 10.0,
    "platform_usage": "TikTok",
    "screen_time_before_sleep": 3.5,
    "performance": 2.5,
    "physical_activity": 0.3,
    "social_interaction_level": "low",
    "anxiety_level": 9,
    "addiction_level": 5,
    "sleep_quality": 2,
    "occupation": "Nurse",
    "bmi_category": "Normal"
}

# ==========================================
# 2. RUN TEST SCRIPT
# ==========================================
API_URL = "http://127.0.0.1:8000/predict"

test_cases = [
    {"name": "Andi 🟢", "payload": ANDI_PAYLOAD},
    {"name": "Budi 🟡", "payload": BUDI_PAYLOAD},
    {"name": "Cici 🔴", "payload": CICI_PAYLOAD},
]

def run_tests():
    print("Mulai testing endpoint API V4.0 (Flattened Payload)...\n" + "="*50)
    
    for case in test_cases:
        name = case["name"]
        payload = case["payload"]
        
        print(f"Mengirim data untuk {name}...")
        try:
            response = requests.post(API_URL, json=payload)
            response.raise_for_status() 
            
            res_json = response.json()
            data = res_json.get("data", {})
            
            mental = data.get("mental_health", {})
            sleep = data.get("sleep_disorder", {})
            wb = data.get("well_being", {})

            print("Status       : Berhasil (200 OK)")
            print(f"Kategori     : {wb.get('emoji', '')} {wb.get('category', 'Unknown')}")
            print(f"WB Score     : {wb.get('well_being_score', 'N/A')} / 100")
            print(f"Mental Score : {wb.get('mental_health_score')} -> Prob: {wb.get('depression_probability')}% ({mental.get('label')})")
            print(f"Sleep Score  : {wb.get('sleep_health_score')} -> {sleep.get('predicted_class')}")
            
        except requests.exceptions.RequestException as e:
            print("Status       : GAGAL")
            print(f"Error        : {e}")
            if response is not None:
                print(f"Detail Response: {response.text}")
        
        print("-" * 50)

if __name__ == "__main__":
    run_tests()