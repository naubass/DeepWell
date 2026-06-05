import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
 
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
 
export const logoutSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const createProfileSchema = Joi.object({
  height: Joi.number().positive().required(),
  weight: Joi.number().positive().required(),
  age: Joi.number().integer().min(1).max(150),
  gender: Joi.string().valid('male', 'female', 'other'),
  fitness_goal: Joi.string(),
  activity_level: Joi.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active'),
  profile_image: Joi.string().allow(''),
});

export const updateProfileSchema = Joi.object({
  height: Joi.number().positive(),
  weight: Joi.number().positive(),
  age: Joi.number().integer().min(1).max(150),
  gender: Joi.string().valid('male', 'female', 'other'),
  fitness_goal: Joi.string(),
  activity_level: Joi.string().valid('sedentary', 'light', 'moderate', 'active', 'very_active'),
  profile_image: Joi.string().allow(''),
}).min(1);

export const updateUserDetailsSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email(),
  password: Joi.string(),
}).min(1);

const VALID_PLATFORM_USAGE = ['Instagram', 'TikTok', 'Both'];
 
const VALID_SOCIAL_INTERACTION = ['low', 'medium', 'high'];
 
export const checkInSchema = Joi.object({
 
    // ── Sleep Data ──────────────────────────────────────────
    sleep_hours: Joi.number()
        .min(0)
        .max(24)
        .precision(2)
        .required()
        .messages({
            'number.base':    '"sleep_hours" harus berupa angka.',
            'number.min':     '"sleep_hours" tidak boleh kurang dari 0.',
            'number.max':     '"sleep_hours" tidak boleh lebih dari 24.',
            'any.required':   '"sleep_hours" wajib diisi.',
        }),
 
    sleep_quality: Joi.number()
        .integer()
        .min(0)
        .max(10)
        .required()
        .messages({
            'number.base':    '"sleep_quality" harus berupa angka bulat.',
            'number.integer': '"sleep_quality" harus berupa angka bulat.',
            'number.min':     '"sleep_quality" harus antara 0 sampai 10.',
            'number.max':     '"sleep_quality" harus antara 0 sampai 10.',
            'any.required':   '"sleep_quality" wajib diisi.',
        }),
 
    sleep_disorder_level: Joi.number()
        .integer()
        .min(0)
        .max(2)
        .required()
        .messages({
            'number.base':    '"sleep_disorder_level" harus berupa angka bulat.',
            'number.integer': '"sleep_disorder_level" harus berupa angka bulat.',
            'number.min':     '"sleep_disorder_level" harus antara 0 sampai 2.',
            'number.max':     '"sleep_disorder_level" harus antara 0 sampai 2.',
            'any.required':   '"sleep_disorder_level" wajib diisi.',
        }),
 
    // ── Mental Health & Lifestyle ───────────────────────────
    stress_level: Joi.number()
        .integer()
        .min(0)
        .max(10)
        .required()
        .messages({
            'number.base':    '"stress_level" harus berupa angka bulat.',
            'number.integer': '"stress_level" harus berupa angka bulat.',
            'number.min':     '"stress_level" harus antara 0 sampai 10.',
            'number.max':     '"stress_level" harus antara 0 sampai 10.',
            'any.required':   '"stress_level" wajib diisi.',
        }),
 
    anxiety_level: Joi.number()
        .integer()
        .min(0)
        .max(10)
        .required()
        .messages({
            'number.base':    '"anxiety_level" harus berupa angka bulat.',
            'number.integer': '"anxiety_level" harus berupa angka bulat.',
            'number.min':     '"anxiety_level" harus antara 0 sampai 10.',
            'number.max':     '"anxiety_level" harus antara 0 sampai 10.',
            'any.required':   '"anxiety_level" wajib diisi.',
        }),
 
    physical_activity: Joi.number()
        .min(0)
        .precision(2)
        .required()
        .messages({
            'number.base':    '"physical_activity" harus berupa angka (menit/hari).',
            'number.min':     '"physical_activity" tidak boleh negatif.',
            'any.required':   '"physical_activity" wajib diisi.',
        }),
 
    performance: Joi.number()
        .min(0)
        .max(100)
        .precision(2)
        .required()
        .messages({
            'number.base':    '"performance" harus berupa angka.',
            'number.min':     '"performance" harus antara 0 sampai 100.',
            'number.max':     '"performance" harus antara 0 sampai 100.',
            'any.required':   '"performance" wajib diisi.',
        }),
 
    addiction_level: Joi.number()
        .integer()
        .min(0)
        .max(10)
        .required()
        .messages({
            'number.base':    '"addiction_level" harus berupa angka bulat.',
            'number.integer': '"addiction_level" harus berupa angka bulat.',
            'number.min':     '"addiction_level" harus antara 0 sampai 10.',
            'number.max':     '"addiction_level" harus antara 0 sampai 10.',
            'any.required':   '"addiction_level" wajib diisi.',
        }),
 
    // ── Digital & Social Interaction ────────────────────────
    daily_social_media_hours: Joi.number()
        .min(0)
        .max(24)
        .precision(2)
        .required()
        .messages({
            'number.base':    '"daily_social_media_hours" harus berupa angka.',
            'number.min':     '"daily_social_media_hours" tidak boleh kurang dari 0.',
            'number.max':     '"daily_social_media_hours" tidak boleh lebih dari 24.',
            'any.required':   '"daily_social_media_hours" wajib diisi.',
        }),
 
    platform_usage: Joi.string()
        .valid(...VALID_PLATFORM_USAGE)
        .required()
        .messages({
            'any.only':     `"platform_usage" harus salah satu dari: ${VALID_PLATFORM_USAGE.join(', ')}.`,
            'any.required': '"platform_usage" wajib diisi.',
        }),
 
    screen_time_before_sleep: Joi.number()
        .min(0)
        .max(24)
        .precision(2)
        .required()
        .messages({
            'number.base':    '"screen_time_before_sleep" harus berupa angka.',
            'number.min':     '"screen_time_before_sleep" tidak boleh kurang dari 0.',
            'number.max':     '"screen_time_before_sleep" tidak boleh lebih dari 24.',
            'any.required':   '"screen_time_before_sleep" wajib diisi.',
        }),
 
    social_interaction_level: Joi.string()
        .valid(...VALID_SOCIAL_INTERACTION)
        .required()
        .messages({
            'any.only':     `"social_interaction_level" harus salah satu dari: ${VALID_SOCIAL_INTERACTION.join(', ')}.`,
            'any.required': '"social_interaction_level" wajib diisi.',
        }),
 
}).options({
    // Field di luar schema akan diabaikan, tidak menyebabkan error.
    // Ini mencegah data kotor masuk ke service tanpa memblokir request.
    allowUnknown: false,
    abortEarly: false, // Kumpulkan SEMUA error sekaligus, bukan berhenti di error pertama
});