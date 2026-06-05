import pkg from 'pg';
const { Pool } = pkg;
import { nanoid } from 'nanoid';
import {
    InvariantError,
    NotFoundError,
    ConflictError,
} from '../exceptions/index.js';

class UserProfileRepository {
    constructor() {
        this._pool = new Pool();
    }

    async createProfile(userId, payload) {
        const id = `profile-${nanoid(16)}`;
        const {
            height,
            weight,
            age,
            gender,
            occupation,
            goal,
            activity_level,
            profile_image,
        } = payload;

        const query = {
            text: `INSERT INTO user_profiles 
                   (id, user_id, height, weight, age, gender, occupation, goal, activity_level, profile_image, is_onboarded) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true) 
                   RETURNING id, user_id, height, weight, age, gender, goal, activity_level, profile_image, is_onboarded`,
            values: [id, userId, height, weight, age, gender, occupation, goal, activity_level, profile_image],
        };

        try {
            const result = await this._pool.query(query);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505' && error.constraint.includes('user_id')) {
                throw new ConflictError('Profile untuk user ini sudah ada.');
            }
            throw error;
        }
    }

    async getProfileByUserId(userId) {
        const query = {
            text: 'SELECT * FROM user_profiles WHERE user_id = $1',
            values: [userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('User profile tidak ditemukan.');
        }

        return result.rows[0];
    }

    async updateProfile(userId, payload) {
        const allowedColumns = ['height', 'weight', 'age', 'gender', 'goal', 'occupation', 'profile_image'];

        const keys = Object.keys(payload);

        if (keys.length === 0) {
            throw new InvariantError('Tidak ada data yang diperbarui.');
        }

        const updateFields = [];
        const values = [];
        let placeholderIndex = 1;

        for (const key of keys) {
            if (allowedColumns.includes(key)) {
                updateFields.push(`${key} = $${placeholderIndex}`);
                values.push(payload[key]);
                placeholderIndex++;
            }
        }

        if (updateFields.length === 0) {
            throw new InvariantError('Payload mengandung atribut yang tidak valid.');
        }

        values.push(userId);

        const query = {
            text: `UPDATE user_profiles 
                   SET ${updateFields.join(', ')}, updated_at = current_timestamp 
                   WHERE user_id = $${placeholderIndex} 
                   RETURNING id, user_id, height, weight, age, gender, goal, activity_level, profile_image, is_onboarded`,
            values: values,
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('User profile tidak ditemukan.');
        }

        return result.rows[0];
    }

    async deleteProfile(userId) {
        const query = {
            text: 'DELETE FROM user_profiles WHERE user_id = $1 RETURNING id',
            values: [userId],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('User profile tidak ditemukan.');
        }

        return result.rows[0];
    }

    async checkProfileExists(userId) {
        const query = {
            text: 'SELECT id FROM user_profiles WHERE user_id = $1 LIMIT 1',
            values: [userId],
        };

        const result = await this._pool.query(query);
        return result.rows.length > 0;
    }
}

export default new UserProfileRepository();