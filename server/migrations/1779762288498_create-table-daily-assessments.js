/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('daily_assessments', {
    // --- META DATA ---
    id: { type: 'uuid', default: pgm.func('gen_random_uuid()'), primaryKey: true },
    user_id: { type: 'VARCHAR(255)', notNull: true, references: '"users"(id)', onDelete: 'CASCADE' },
    assessment_date: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') },

    // --- Shared Data ---
    age: { type: 'integer', notNull: true },
    gender: { type: 'varchar(10)', notNull: true },

    // --- USER INPUTS ---
    // (daily_sleep_hours dihapus dari sini karena duplikat)
    daily_social_media_hours: { type: 'real', notNull: true },
    platform_usage: { type: 'varchar(20)', notNull: true },
    screen_time_before_sleep: { type: 'real', notNull: true },
    performance: { type: 'real', notNull: true }, 
    physical_activity: { type: 'real', notNull: true },
    social_interaction_level: { type: 'varchar(10)', notNull: true }, 
    mental_stress_level: { type: 'integer', notNull: true }, 
    anxiety_level: { type: 'integer', notNull: true }, 
    addiction_level: { type: 'integer', notNull: true },
    sleep_duration: { type: 'real', notNull: true }, // <-- KITA PAKAI INI
    sleep_quality: { type: 'integer', notNull: true },
    sleep_disorder_level: { type: 'integer', notNull: true }, 
    occupation: { type: 'varchar(50)', notNull: true },
    bmi_category: { type: 'varchar(20)', notNull: true },

    // --- AI RESULTS ---
    well_being_score: { type: 'real', notNull: true },
    mental_health_score: { type: 'real', notNull: true },
    sleep_health_score: { type: 'real', notNull: true },
    depression_probability: { type: 'real', notNull: true },
    depression_label: { type: 'varchar(50)', notNull: true },
    sleep_disorder_class: { type: 'varchar(50)', notNull: true },
    sleep_confidence: { type: 'real', notNull: true },
    category: { type: 'varchar(20)', notNull: true }, 
    emoji: { type: 'varchar(10)' }, 

    // --- tambahan? (optional) ---
    daily_journaling: { type: 'text', notNull: false }, // Ubah ke 'text' agar bisa menampung curhatan panjang
  });

  pgm.createIndex('daily_assessments', ['user_id', 'assessment_date']);
};

export const down = (pgm) => {
  pgm.dropIndex('daily_assessments', ['user_id', 'assessment_date']);
  pgm.dropTable('daily_assessments');
};