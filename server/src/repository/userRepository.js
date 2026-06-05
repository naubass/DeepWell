import pkg from 'pg';
const { Pool } = pkg;
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import {
    InvariantError,
    NotFoundError,
    ConflictError,
    AuthenticationError,
} from '../exceptions/index.js';
import dotenv from 'dotenv'
dotenv.config();

class UserRepository {
    constructor() {
        this._pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false 
        }
        });
    }

    async createUser({ name, email, password, role }) {
        const id = `user-${nanoid(16)}`;
        const passwordHash = await bcrypt.hash(password, 10);

        const query = {
            text: 'INSERT INTO users (id, name, email, password, role) VALUES($1, $2, $3, $4, $5) RETURNING id, name',
            values: [id, name, email, passwordHash, role],
        };

        try {
            const result = await this._pool.query(query);
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505' && error.constraint.includes('email')) {
                throw new ConflictError('Email sudah digunakan.');
            }
            throw error;
        }
    }

    async updateUserById(id, payload) {
        const keys = Object.keys(payload);

        if (keys.length === 0) {
            throw new InvariantError('Tidak ada data yang diperbarui.');
        }

        const allowedColumns = ['name', 'email', 'password', 'role'];
        const updateFields = [];
        const values = [];
        let placeholderIndex = 1;

        for (const key of keys) {
            if (allowedColumns.includes(key)) {
                updateFields.push(`${key} = $${placeholderIndex}`);

                if (key === 'password') {
                    const hashed = await bcrypt.hash(payload[key], 10);
                    values.push(hashed);
                } else {
                    values.push(payload[key]);
                }

                placeholderIndex++;
            }
        }

        if (updateFields.length === 0) {
            throw new InvariantError('Payload mengandung atribut yang tidak valid.');
        }

        values.push(id);

        const query = {
            text: `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${placeholderIndex} RETURNING id, name, email, role`,
            values: values,
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('User tidak ditemukan.');
        }

        return result.rows[0];
    }

    async getUserById(id) {
        const query = {
            text: 'SELECT id, name, email, role FROM users WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('User tidak ditemukan.');
        }

        return result.rows[0];
    }

    async getUserByEmailAndPassword(email, password) {
        const query = {
            text: 'SELECT id, password FROM users WHERE email = $1',
            values: [email],
        };

        const result = await this._pool.query(query);
        const user = result.rows[0];

        // Pesan error sengaja digeneralisasi agar tidak bocorkan apakah email terdaftar atau tidak
        if (!user) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah.');
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            throw new AuthenticationError('Kredensial yang Anda berikan salah.');
        }

        return user.id;
    }
}

export default new UserRepository();