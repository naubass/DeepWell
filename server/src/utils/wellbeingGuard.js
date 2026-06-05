// ============================================================
// wellbeingGuard.js
// Rule-Based Override (Guardrails) untuk hasil AI DeepWell
//
// FILOSOFI:
// Guard ini TIDAK mengganti model AI. Ia bekerja SETELAH model
// memberikan hasil, dan hanya mengambil alih jika ditemukan
// kondisi klinis yang secara objektif berbahaya namun
// tidak tertangkap dengan benar oleh model.
//
// ARSITEKTUR: Multi-pass (semua rules diperiksa)
// Semua rules yang match akan diterapkan sekaligus.
// Setiap rule hanya bertanggung jawab atas domain-nya sendiri
// (mental atau sleep) sehingga tidak ada tumpang tindih.
// Kategori akhir dihitung ULANG dari skor yang sudah dikoreksi.
// ============================================================

// ── Helper: hitung ulang kategori dari skor ──────────────────
const scoreToCategory = (score) => {
    if (score >= 85) return { category: 'Excellent',      emoji: '🟢' };
    if (score >= 50) return { category: 'Fair',           emoji: '🟡' };
    return              { category: 'Need Attention',     emoji: '🔴' };
};

// ── Definisi rules ───────────────────────────────────────────
// Domain 'mental' → hanya mengubah mental_health_score & depression
// Domain 'sleep'  → hanya mengubah sleep_health_score & sleep_disorder
// Domain 'both'   → cap kedua domain
//
// cap: nilai maksimum yang diizinkan untuk skor domain tersebut
// forceDepression: paksa label depression
// forceSleepDisorder: paksa predicted_class gangguan tidur
// ─────────────────────────────────────────────────────────────

const RULES = [
    // ── MENTAL: stress sangat tinggi ─────────────────────────
    {
        id:     'high_stress',
        domain: 'mental',
        check:  (inp) => inp.stress_level >= 8,
        cap:    55,
        reason: 'Stress level ≥8',
    },
    {
        id:     'high_anxiety',
        domain: 'mental',
        check:  (inp) => inp.anxiety_level >= 8,
        cap:    55,
        reason: 'Anxiety level ≥8',
    },
    {
        id:              'critical_combined_mental',
        domain:          'mental',
        check:           (inp) => inp.stress_level >= 9 && inp.anxiety_level >= 9,
        cap:             25,
        forceDepression: true,
        reason:          'Stress & anxiety keduanya ≥9 — kondisi mental kritis',
    },
    {
        id:     'zero_performance_high_stress',
        domain: 'mental',
        check: (inp) => inp.performance <= 4 && inp.stress_level >= 7,
        cap:    50,
        reason: 'Performa sangat rendah + stres tinggi',
    },

    // ── SLEEP: kualitas & durasi tidur buruk ──────────────────
    {
        id:     'poor_sleep_quality',
        domain: 'sleep',
        check:  (inp) => inp.sleep_hours < 5 && inp.sleep_quality <= 3,
        cap:    40,
        reason: 'Tidur < 5 jam dengan kualitas rendah',
    },
    {
        id:                 'critical_sleep_deprivation',
        domain:             'sleep',
        check:              (inp) => inp.sleep_hours < 3,
        cap:                20,
        forceSleepDisorder: 'Insomnia',
        reason:             'Tidur di bawah 3 jam — deprivasi tidur akut',
    },
    {
        id:                 'severe_sleep_disorder',
        domain:             'sleep',
        check:              (inp) => inp.sleep_disorder_level === 2 && inp.sleep_hours < 5,
        cap:                25,
        forceSleepDisorder: 'Insomnia',
        reason:             'Gangguan tidur berat (level 2) + tidur < 5 jam',
    },
    {
        id:     'high_screen_time_poor_sleep',
        domain: 'sleep',
        check:  (inp) => inp.screen_time_before_sleep >= 3 && inp.sleep_quality <= 4,
        cap:    45,
        reason: 'Screen time tinggi sebelum tidur + kualitas tidur rendah',
    },
    {
        id:     'insufficient_sleep_duration',
        domain: 'sleep',
        check:  (inp) => inp.sleep_hours <= 4.5,
        cap:    55, 
        reason: 'Durasi tidur sangat kurang (≤ 4.5 jam), terlepas dari kualitasnya',
    },
    {
        id:     'medium_anxiety_stress',
        domain: 'mental',
        check:  (inp) => inp.anxiety_level >= 5 || inp.stress_level >= 5,
        cap:    79, // Mengunci agar maksimal hanya mendapat skor baik (Fair/Good), tidak Excellent
        reason: 'Tingkat stres atau kecemasan berada di level menengah (≥ 5)',
    },
];


// ── Fungsi utama ─────────────────────────────────────────────
// input    : checkInData dari user (12 field)
// aiResult : mlData.data dari FastAPI { well_being, mental_health, sleep_disorder }
//
// Return   : { aiResult (terkoreksi), overrideApplied, overrideReasons[] }

export const applyWellbeingGuard = (input, aiResult) => {
    const { well_being, mental_health, sleep_disorder } = aiResult;

    // Clone semua object agar tidak mutate hasil AI asli
    const correctedWellBeing    = { ...well_being };
    const correctedMentalHealth = { ...mental_health };
    const correctedSleepDisorder = { ...sleep_disorder };

    const triggeredReasons = [];

    // Lacak cap paling ketat yang match per domain
    let mentalCap       = correctedWellBeing.mental_health_score; // default: nilai AI asli
    let sleepCap        = correctedWellBeing.sleep_health_score;
    let forceDepression = false;
    let forcedSleepDisorder = null;

    // ── Pass: periksa semua rules ─────────────────────────────
    for (const rule of RULES) {
        if (!rule.check(input)) continue;

        triggeredReasons.push({ id: rule.id, reason: rule.reason });

        if (rule.domain === 'mental' || rule.domain === 'both') {
            // Ambil cap yang paling ketat (nilai terkecil)
            mentalCap = Math.min(mentalCap, rule.cap ?? mentalCap);
            if (rule.forceDepression) forceDepression = true;
        }

        if (rule.domain === 'sleep' || rule.domain === 'both') {
            sleepCap = Math.min(sleepCap, rule.cap ?? sleepCap);
            if (rule.forceSleepDisorder) forcedSleepDisorder = rule.forceSleepDisorder;
        }
    }

    // Tidak ada rule yang match → kembalikan hasil AI apa adanya
    if (triggeredReasons.length === 0) {
        return { aiResult, overrideApplied: false, overrideReasons: [] };
    }

    // ── Terapkan koreksi ──────────────────────────────────────

    // Koreksi mental health score
    correctedWellBeing.mental_health_score = Math.min(
        correctedWellBeing.mental_health_score,
        mentalCap
    );

    // Koreksi sleep health score
    correctedWellBeing.sleep_health_score = Math.min(
        correctedWellBeing.sleep_health_score,
        sleepCap
    );

    let averageScore = (correctedWellBeing.mental_health_score + correctedWellBeing.sleep_health_score) / 2;

    // Jika salah satu skor sangat hancur (< 40), jangan biarkan rata-ratanya selamat ke zona kuning (> 50)
    if (correctedWellBeing.mental_health_score <= 40 || correctedWellBeing.sleep_health_score <= 40) {
        averageScore = Math.min(averageScore, 45); // Kunci maksimal di 45 agar tetap 'Need Attention' 🔴
    }

    correctedWellBeing.well_being_score = parseFloat(averageScore.toFixed(2));

    // Hitung ulang kategori & emoji dari skor akhir
    const { category, emoji } = scoreToCategory(correctedWellBeing.well_being_score);
    correctedWellBeing.category = category;
    correctedWellBeing.emoji    = emoji;

    // Override depression label jika diperlukan
    if (forceDepression) {
        correctedMentalHealth.label                  = 'Depression';
        correctedMentalHealth.probability_depression = Math.max(
            correctedMentalHealth.probability_depression,
            0.85  // minimum confidence jika dipaksa
        );
    }

    if (forcedSleepDisorder) {
        // Hanya overwrite jika AI sebelumnya bilang sehat/None
        if (correctedSleepDisorder.predicted_class === 'None' || correctedSleepDisorder.predicted_class === 'Normal') {
            correctedSleepDisorder.predicted_class = forcedSleepDisorder;
        }
    }

    // Log audit trail
    console.warn(
        `[WellbeingGuard] ${triggeredReasons.length} rule(s) triggered:\n` +
        triggeredReasons.map((r) => `  • [${r.id}] ${r.reason}`).join('\n') + '\n' +
        `  Score: ${well_being.well_being_score.toFixed(2)} → ${correctedWellBeing.well_being_score.toFixed(2)} | ` +
        `Category: ${well_being.category} → ${correctedWellBeing.category}`
    );

    return {
        aiResult: {
            well_being:    correctedWellBeing,
            mental_health: correctedMentalHealth,
            sleep_disorder: correctedSleepDisorder,
        },
        overrideApplied: true,
        overrideReasons: triggeredReasons,
    };
};