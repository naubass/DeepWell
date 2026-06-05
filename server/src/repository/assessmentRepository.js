import pg from 'pg';
const { Pool } = pg;
import { calculateBMICategory } from '../utils/bmi.js';
import dotenv from 'dotenv';
import {
    ConflictError,
    ForbiddenError,
    ExternalServiceError,
} from '../exceptions/index.js';

dotenv.config();

class AssessmentRepository {
    constructor() {
        this._pool = new Pool();
    }

    // processDailyCheckIn
    // Tanggung jawab:
    //   1. Ambil profil user dari DB
    //   2. Guard: cek duplicate check-in hari ini
    //   3. Hitung BMI category
    //   4. Kirim payload ke FastAPI ML
    //   5. Simpan hasil assessment ke DB
    //   6. Return data hasil ke controller
    async processDailyCheckIn(userId, checkInData) {
        try {
            // 1. Ambil profil user
            const profileResult = await this._pool.query(
                `SELECT age, gender, occupation, weight, height
                 FROM user_profiles
                 WHERE user_id = $1`,
                [userId]
            );

            if (profileResult.rows.length === 0) {
                throw new ForbiddenError("Please complete your profile onboarding first.");
            }

            const profile = profileResult.rows[0];

            // 2. Guard duplicate check-in
            const todayCheck = await this._pool.query(
                `SELECT id FROM daily_assessments
                 WHERE user_id = $1 AND DATE(assessment_date) = CURRENT_DATE`,
                [userId]
            );

            if (todayCheck.rows.length > 0) {
                throw new ConflictError("You have already checked in today.");
            }

            // 3. Hitung BMI category
            const bmiCategory = calculateBMICategory(
                parseFloat(profile.weight),
                parseFloat(profile.height)
            );

            // 4. Susun & kirim payload ke FastAPI
            // Tipe data dikonversi eksplisit agar lolos validasi Pydantic
            const mlPayload = {
                age:                        parseInt(profile.age),
                gender:                     profile.gender,
                occupation:                 profile.occupation,
                bmi_category:               bmiCategory,
                sleep_hours:                parseFloat(checkInData.sleep_hours),
                sleep_quality:              parseInt(checkInData.sleep_quality),
                sleep_disorder_level:       parseInt(checkInData.sleep_disorder_level),
                stress_level:               parseInt(checkInData.stress_level),
                anxiety_level:              parseInt(checkInData.anxiety_level),
                physical_activity:          parseFloat(checkInData.physical_activity),
                performance:                parseFloat(checkInData.performance),
                addiction_level:            parseInt(checkInData.addiction_level),
                daily_social_media_hours:   parseFloat(checkInData.daily_social_media_hours),
                platform_usage:             checkInData.platform_usage,
                screen_time_before_sleep:   parseFloat(checkInData.screen_time_before_sleep),
                social_interaction_level:   checkInData.social_interaction_level,
            };

            const mlResponse = await fetch(`${process.env.ML_API_URL}/predict`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(mlPayload),
                signal:  AbortSignal.timeout(10000),
            });

            if (!mlResponse.ok) {
                throw new ExternalServiceError(`AI Engine returned an error (HTTP ${mlResponse.status}).`);
            }

            const mlData = await mlResponse.json();

            if (!mlData.success) {
                throw new ExternalServiceError("AI Engine returned an unsuccessful response.");
            }

            // 5. Simpan hasil ke DB (langsung dari response ML)
            const { well_being, mental_health, sleep_disorder } = mlData.data;

            const insertResult = await this._pool.query(
                `INSERT INTO daily_assessments (
                    user_id, age, gender,
                    daily_social_media_hours, platform_usage, screen_time_before_sleep,
                    performance, physical_activity, social_interaction_level,
                    mental_stress_level, anxiety_level, addiction_level,
                    sleep_duration, sleep_quality, sleep_disorder_level,
                    occupation, bmi_category,
                    well_being_score, mental_health_score, sleep_health_score,
                    depression_probability, depression_label,
                    sleep_disorder_class, sleep_confidence,
                    category, emoji
                ) VALUES (
                    $1,  $2,  $3,  $4,  $5,  $6,
                    $7,  $8,  $9,  $10, $11, $12,
                    $13, $14, $15, $16, $17,
                    $18, $19, $20, $21, $22,
                    $23, $24, $25, $26
                ) RETURNING id, assessment_date`,
                [
                    // identitas & profil
                    userId,
                    profile.age,
                    profile.gender,
                    // digital & social
                    checkInData.daily_social_media_hours,
                    checkInData.platform_usage,
                    checkInData.screen_time_before_sleep,
                    // lifestyle
                    checkInData.performance,
                    checkInData.physical_activity,
                    checkInData.social_interaction_level,
                    // mental health
                    checkInData.stress_level,       // → mental_stress_level
                    checkInData.anxiety_level,
                    checkInData.addiction_level,
                    // sleep
                    checkInData.sleep_hours,        // → sleep_duration
                    checkInData.sleep_quality,
                    checkInData.sleep_disorder_level,
                    // profil (computed)
                    profile.occupation,
                    bmiCategory,
                    // hasil AI
                    well_being.well_being_score,
                    well_being.mental_health_score,
                    well_being.sleep_health_score,
                    // hasil AI: mental health
                    mental_health.probability_depression,
                    mental_health.label,
                    // hasil AI: sleep disorder
                    sleep_disorder.predicted_class,
                    sleep_disorder.confidence,
                    // kategori & visual
                    well_being.category,
                    well_being.emoji,
                ]
            );

            // 6. Return ke controller
            return {
                assessmentId:   insertResult.rows[0].id,
                assessmentDate: insertResult.rows[0].assessment_date,
                result:         mlData.data,
            };

        } catch (error) {
            console.error("[AssessmentRepository] processDailyCheckIn:", error.message);
            throw error;
        }
    }

    // getTodayStatus
    // Cek apakah user sudah check-in hari ini.
    // Return: { has_checked_in: bool, data: row | null }
    async getTodayStatus(userId) {
        try {
            const result = await this._pool.query(
                `SELECT
                    id, assessment_date,
                    well_being_score, mental_health_score, sleep_health_score,
                    depression_label, sleep_disorder_class,
                    category, emoji
                 FROM daily_assessments
                 WHERE user_id = $1 AND DATE(assessment_date) = CURRENT_DATE
                 ORDER BY assessment_date DESC
                 LIMIT 1`,
                [userId]
            );

            if (result.rows.length === 0) {
                return { has_checked_in: false, data: null };
            }

            return { has_checked_in: true, data: result.rows[0] };

        } catch (error) {
            console.error("[AssessmentRepository] getTodayStatus:", error.message);
            throw error;
        }
    }

    // getAssessmentHistory
    // Ambil riwayat assessment user, diurutkan terbaru.
    // Limit sudah divalidasi & di-sanitize di controller.
    async getAssessmentHistory(userId, limit = 30) {
        try {
            const result = await this._pool.query(
                `SELECT
                    id,
                    assessment_date,
                    well_being_score,
                    mental_health_score,
                    sleep_health_score,
                    category,
                    emoji
                 FROM daily_assessments
                 WHERE user_id = $1
                 ORDER BY assessment_date DESC
                 LIMIT $2`,
                [userId, limit]
            );

            return result.rows;

        } catch (error) {
            console.error("[AssessmentRepository] getAssessmentHistory:", error.message);
            throw error;
        }
    }
}

export default new AssessmentRepository();