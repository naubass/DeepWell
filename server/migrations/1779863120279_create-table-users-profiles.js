/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('user_profiles', {
    id: {
      type: 'VARCHAR(255)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(255)',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'cascade',
      unique: true, // Memastikan relasi ketat 1-to-1
    },
    height: {
      type: 'numeric(5, 2)',
      comment: 'Height in cm',
    },
    weight: {
      type: 'numeric(6, 2)',
      comment: 'Weight in kg',
    },
    age: {
      type: 'integer',
    },
    gender: {
      type: 'varchar(20)',
    },
    occupation: {
      type: 'varchar(50)', 
      comment: 'User occupation for AI model',
    },
    goal: {
      type: 'varchar(255)',
    },
    activity_level: {
      type: 'varchar(20)',
    },
    profile_image: {
      type: 'text',
    },
    is_onboarded: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('user_profiles', ['user_id'], { unique: true });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('user_profiles');
};