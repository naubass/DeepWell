"""
FastAPI Backend — Mental Health + Sleep Disorder + Well-Being
Versi: 4.0 (Flattened Payload - API Simpel untuk Frontend)
"""

import os
import pickle
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Literal
from contextlib import asynccontextmanager

# ============================================================================
# 1. CUSTOM LAYERS & LOSSES
# ============================================================================
class ResidualBlock(layers.Layer):
    def __init__(self, units: int, dropout_rate: float = 0.3, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.dropout_rate = dropout_rate
        self.dense1 = layers.Dense(units, use_bias=False)
        self.bn1 = layers.BatchNormalization()
        self.act1 = layers.Activation('swish')
        self.drop1 = layers.Dropout(dropout_rate)
        self.dense2 = layers.Dense(units, use_bias=False)
        self.bn2 = layers.BatchNormalization()
        self.act2 = layers.Activation('swish')
        self.proj = None

    def build(self, input_shape):
        if input_shape[-1] != self.units:
            self.proj = layers.Dense(self.units, use_bias=False)
        super().build(input_shape)

    def call(self, x, training=False):
        shortcut = self.proj(x) if self.proj else x
        x = self.dense1(x)
        x = self.bn1(x, training=training)
        x = self.act1(x)
        x = self.drop1(x, training=training)
        x = self.dense2(x)
        x = self.bn2(x, training=training)
        x = self.act2(x + shortcut)
        return x

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'units': self.units, 'dropout_rate': self.dropout_rate})
        return cfg


class AttentionGating(layers.Layer):
    def __init__(self, units: int, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.W = layers.Dense(units, activation='relu', use_bias=False)
        self.V = layers.Dense(units, activation='sigmoid', use_bias=False)

    def call(self, x, training=False):
        score = self.W(x)
        gate = self.V(score)
        return x * gate

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'units': self.units})
        return cfg


class FocalLoss(keras.losses.Loss):
    def __init__(self, alpha: float = 0.25, gamma: float = 2.0, label_smoothing: float = 0.05, **kwargs):
        super().__init__(**kwargs)
        self.alpha = alpha
        self.gamma = gamma
        self.label_smoothing = label_smoothing

    def call(self, y_true, y_pred):
        y_true = tf.cast(y_true, tf.float32)
        y_pred = tf.cast(y_pred, tf.float32)
        y_true_smooth = y_true * (1 - self.label_smoothing) + 0.5 * self.label_smoothing
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1 - 1e-7)
        bce = -(y_true_smooth * tf.math.log(y_pred) + (1 - y_true_smooth) * tf.math.log(1 - y_pred))
        p_t = y_true * y_pred + (1 - y_true) * (1 - y_pred)
        focal_weight = tf.pow(1 - p_t, self.gamma)
        alpha_t = y_true * self.alpha + (1 - y_true) * (1 - self.alpha)
        loss = alpha_t * focal_weight * bce
        return tf.reduce_mean(loss)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'alpha': self.alpha, 'gamma': self.gamma, 'label_smoothing': self.label_smoothing})
        return cfg


class SparseFocalLoss(keras.losses.Loss):
    def __init__(self, alpha: float = 0.25, gamma: float = 2.0, label_smoothing: float = 0.05, **kwargs):
        super().__init__(**kwargs)
        self.alpha = alpha
        self.gamma = gamma
        self.label_smoothing = label_smoothing

    def call(self, y_true, y_pred):
        y_true = tf.cast(y_true, tf.int32)
        y_pred = tf.cast(y_pred, tf.float32)
        y_pred = tf.clip_by_value(y_pred, 1e-7, 1 - 1e-7)
        num_classes = tf.shape(y_pred)[-1]
        y_true_oh = tf.one_hot(y_true, num_classes)
        y_smooth = y_true_oh * (1 - self.label_smoothing) + (self.label_smoothing / tf.cast(num_classes, tf.float32))
        ce = -tf.reduce_sum(y_smooth * tf.math.log(y_pred), axis=-1)
        p_t = tf.reduce_sum(y_true_oh * y_pred, axis=-1)
        focal = tf.pow(1 - p_t, self.gamma)
        loss = self.alpha * focal * ce
        return tf.reduce_mean(loss)

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'alpha': self.alpha, 'gamma': self.gamma, 'label_smoothing': self.label_smoothing})
        return cfg


CUSTOM_OBJECTS = {
    'ResidualBlock': ResidualBlock,
    'AttentionGating': AttentionGating,
    'FocalLoss': FocalLoss,
    'SparseFocalLoss': SparseFocalLoss,
}


# ============================================================================
# 2. INFERENCE CLASSES
# ============================================================================
class MentalHealthPredictor:
    LABEL_MAP = {0: 'No Depression', 1: 'Depression'}
    CATEGORICAL_MAP = {
        'gender': {'male': 1, 'female': 0},
        'social_interaction_level': {'low': 0, 'medium': 1, 'high': 2},
        'platform_usage': {'Instagram': 0, 'TikTok': 1, 'Both': 2},
    }

    def __init__(self, model_path, scaler_path, features_path):
        self.model = keras.models.load_model(model_path, custom_objects=CUSTOM_OBJECTS)
        with open(scaler_path, 'rb') as f: self.scaler = pickle.load(f)
        with open(features_path, 'rb') as f: self.feature_names = pickle.load(f)

    def _preprocess(self, raw: dict) -> np.ndarray:
        df_input = pd.DataFrame([raw])
        for col, mapping in self.CATEGORICAL_MAP.items():
            if col in df_input.columns:
                df_input[col] = df_input[col].map(mapping).fillna(df_input[col])
        
        df_input['screen_sleep_ratio'] = df_input['daily_social_media_hours'] / (df_input['sleep_hours'] + 1e-3)
        df_input['social_engagement'] = df_input['social_interaction_level'] * df_input['physical_activity']
        df_input['mental_load_index'] = (df_input['anxiety_level'] + df_input['stress_level']) / 2.0
        
        df_features = df_input[self.feature_names]
        return self.scaler.transform(df_features).astype(np.float32)

    def predict(self, raw_input: dict, threshold: float = 0.5) -> dict:
        X = self._preprocess(raw_input)
        prob = float(self.model.predict(X, verbose=0).squeeze())
        label = int(prob >= threshold)
        return {
            'probability_depression': round(prob, 4),
            'prediction': label,
            'label': self.LABEL_MAP[label],
            'confidence': round(max(prob, 1 - prob) * 100, 2)
        }

class SleepPredictor:
    def __init__(self, model_path, scaler_path, features_path, classes_path):
        self.model = keras.models.load_model(model_path, custom_objects=CUSTOM_OBJECTS)
        with open(scaler_path, 'rb') as f: self.scaler = pickle.load(f)
        with open(features_path, 'rb') as f: self.feature_names = pickle.load(f)
        with open(classes_path, 'rb') as f: self.classes = pickle.load(f)

    def _preprocess(self, raw: dict) -> np.ndarray:
        df = pd.DataFrame([raw])

        # ── PERBAIKAN UMUR & PEMETAAN SLEEP_HOURS ──
        df['age'] = df['age'].clip(lower=27, upper=80)
        df['stress_level'] = raw.get('sleep_disorder_level', 0)
        df['sleep_duration'] = raw.get('sleep_hours', 0)  # Mapping jam tidur
        df['sleep_efficiency'] = raw.get('sleep_hours', 0) / 8.0
        
        # One-hot encoding
        gender_lower = raw.get('gender', '').lower()
        df['gender_Female'] = 1 if gender_lower == 'female' else 0
        df['gender_Male']   = 1 if gender_lower == 'male'   else 0

        VALID_OCCUPATIONS = ['Accountant', 'Artist', 'Chef', 'Doctor', 'Engineer', 'Lawyer', 'Manager', 'Nurse', 'Sales Representative', 'Salesperson', 'Scientist', 'Software Engineer', 'Student', 'Teacher', 'Writer']
        for occ in VALID_OCCUPATIONS:
            df[f'occupation_{occ}'] = 1 if raw.get('occupation') == occ else 0

        VALID_BMI_CATS = ['Normal', 'Obese', 'Overweight', 'Underweight']
        for bmi in VALID_BMI_CATS:
            df[f'bmi_cat_{bmi}'] = 1 if raw.get('bmi_category') == bmi else 0

        df_features = df[self.feature_names]
        return self.scaler.transform(df_features).astype(np.float32)

    def predict(self, raw: dict) -> dict:
        X = self._preprocess(raw)
        probs = self.model.predict(X, verbose=0).squeeze()
        pred_idx = int(np.argmax(probs))
        predicted_class = self.classes[pred_idx]
        return {
            'predicted_class': predicted_class,
            'confidence': round(float(probs[pred_idx]) * 100, 2),
            'class_probabilities': {c: round(float(p) * 100, 2) for c, p in zip(self.classes, probs)},
        }

# ============================================================================
# 3. WELL-BEING AGGREGATOR
# ============================================================================
SLEEP_PENALTY = {
    'No': 0, 'Insomnia': 20, 'Restless Leg Syndrome': 25, 'Narcolepsy': 30, 'Sleep Apnea': 30,
}

def compute_wellbeing(mental_result: dict, sleep_result: dict, raw: dict) -> dict:
    mental_score = round((1.0 - mental_result['probability_depression']) * 100, 2)

    sleep_class = sleep_result['predicted_class']
    penalty = SLEEP_PENALTY.get(sleep_class, 20)
    confidence = sleep_result['confidence'] / 100.0
    model_score = max(0.0, 100.0 - (penalty * confidence))

    # Ekstraksi numerik
    quality = float(raw.get('sleep_quality', 5)) / 10.0
    sleep_hours = float(raw.get('sleep_hours', 0))
    efficiency = min(1.25, sleep_hours / 8.0)
    
    # Inversi stress_level model sleep (skala 0-2) ke (0-1)
    stress_val = float(raw.get('sleep_disorder_level', 0))
    stress_inv = 1.0 - (stress_val / 2.0)

    numeric_score = (quality * 0.45 + efficiency * 0.35 + stress_inv * 0.20) * 100
    sleep_score = round(0.60 * model_score + 0.40 * numeric_score, 2)

    wb_score = round((mental_score + sleep_score) / 2, 2)

    if wb_score >= 85:
        category, emoji = 'Excellent', '🟢'
    elif wb_score >= 50:
        category, emoji = 'Fair', '🟡'
    else:
        category, emoji = 'Need Attention', '🔴'

    return {
        'mental_health_score': mental_score,
        'sleep_health_score':  sleep_score,
        'well_being_score':    wb_score,
        'category':            category,
        'emoji':               emoji,
    }

# ============================================================================
# 4. FASTAPI APP & SCHEMA
# ============================================================================
class PredictInput(BaseModel):
    # Shared
    age: int = Field(..., ge=10, le=80)
    gender: str = Field(..., description="Jenis kelamin: male/female")
    sleep_hours: float = Field(..., ge=0, le=24, description="Otomatis dipakai untuk sleep_duration & sleep_efficiency")
    stress_level: int = Field(..., ge=0, le=10, description="Fitur Mental Model (0-10)")
    sleep_disorder_level: int = Field(..., ge=0, le=2, description="Fitur Sleep Model (0-2)")

    # Mental Health
    daily_social_media_hours: float
    platform_usage: Literal['Instagram', 'TikTok', 'Both']
    screen_time_before_sleep: float
    performance: float 
    physical_activity: float
    social_interaction_level: Literal['low', 'medium', 'high']
    anxiety_level: int = Field(..., ge=0, le=10)
    addiction_level: int = Field(..., ge=0, le=10)

    # Sleep Disorder
    sleep_quality: int = Field(..., ge=0, le=10)
    occupation: str
    bmi_category: Literal['Normal', 'Obese', 'Overweight', 'Underweight']

    @field_validator('gender')
    @classmethod
    def normalize_gender(cls, v: str) -> str:
        v_lower = v.strip().lower()
        if v_lower not in ('male', 'female'):
            raise ValueError("gender harus 'male' atau 'female'")
        return v_lower

state = {
    "mental_predictor": None,
    "sleep_predictor":  None,
}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Loading models...")
    MODEL_DIR = os.getenv("MODEL_DIR", "./")
    try:
        state["mental_predictor"] = MentalHealthPredictor(
            os.path.join(MODEL_DIR, "mental_health_model.keras"),
            os.path.join(MODEL_DIR, "scaler.pkl"),
            os.path.join(MODEL_DIR, "feature_names.pkl")
        )
        print("✅ Mental model loaded")
    except Exception as e: print(f"❌ Gagal load Mental: {e}")

    try:
        state["sleep_predictor"] = SleepPredictor(
            os.path.join(MODEL_DIR, "sleep_model.keras"),
            os.path.join(MODEL_DIR, "scaler_sleep.pkl"),
            os.path.join(MODEL_DIR, "sleep_feature_names.pkl"),
            os.path.join(MODEL_DIR, "sleep_classes.pkl")
        )
        print("✅ Sleep model loaded")
    except Exception as e: print(f"❌ Gagal load Sleep: {e}")
    yield
    state.clear()

app = FastAPI(title="Well-Being Inference API (Flattened V4.0)", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.post("/predict")
def predict(payload: PredictInput):
    if not state["mental_predictor"] or not state["sleep_predictor"]:
        raise HTTPException(status_code=503, detail="Models belum siap.")

    try:
        raw = payload.model_dump()
        
        mental_result = state["mental_predictor"].predict(raw)
        sleep_result  = state["sleep_predictor"].predict(raw)
        wellbeing     = compute_wellbeing(mental_result, sleep_result, raw)

        return {
            "success": True,
            "data": {
                "mental_health":  mental_result,
                "sleep_disorder": sleep_result,
                "well_being":     wellbeing,
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)