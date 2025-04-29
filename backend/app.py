from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model dan scaler
MODEL_PATH = "../backend/logistic_model.sav"
SCALER_PATH = "../backend/scaler.sav"

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✅ Model dan scaler berhasil dimuat.")
except Exception as e:
    print(f"❌ Error loading model or scaler: {e}")
    model, scaler = None, None

# Fitur yang diharapkan oleh model
EXPECTED_FEATURES = [
    "Age", "Education", "Initial_Capital", "Financial_Record_Keeping",
    "Internet_Usage", "Business_Plan", "Marketing_Effort", "Partnership",
    "Parent_Business_Experience", "Industry_Experience", "Owner_Gender",
    "Professional_Advice"
]

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({"error": "Model atau scaler tidak ditemukan."}), 500

    try:
        # Ambil data JSON dari frontend
        data = request.json

        # Pastikan input adalah dictionary
        if not isinstance(data, dict):
            return jsonify({"error": "Format input tidak valid. Harus dalam bentuk JSON."}), 400

        # Periksa apakah semua fitur yang dibutuhkan ada
        missing_features = [feature for feature in EXPECTED_FEATURES if feature not in data]
        if missing_features:
            return jsonify({"error": f"Fitur yang kurang: {missing_features}"}), 400

        # Konversi data menjadi DataFrame dengan urutan fitur yang sesuai
        try:
            features = pd.DataFrame([data])[EXPECTED_FEATURES]
            features = features.apply(pd.to_numeric, errors='coerce')  # Pastikan semua numerik
        except Exception as e:
            return jsonify({"error": f"Kesalahan konversi data: {e}"}), 400

        # Jika ada NaN setelah konversi, berikan error
        if features.isnull().values.any():
            return jsonify({"error": "Data tidak valid, pastikan semua nilai adalah angka."}), 400

        # Normalisasi dengan scaler
        scaled_features = scaler.transform(features)

        # Prediksi dengan model
        prediction = model.predict(scaled_features)[0]
        probability = model.predict_proba(scaled_features)[0][1]

        # Kirim hasil prediksi ke frontend
        return jsonify({
            "prediction": int(prediction),
            "probability": round(float(probability), 4)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    if model and scaler:
        print("🚀 Server berjalan di http://127.0.0.1:5000")
        app.run(debug=True, port=5000)
    else:
        print("❌ Tidak dapat menjalankan server karena model atau scaler tidak tersedia.")
