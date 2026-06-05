import pg from 'pg';
const { Pool } = pg;
import { nanoid } from 'nanoid';

class AuthRepository {
    constructor() {
        this._pool = new Pool();
    }

    async generateRefreshToken(refreshToken) {
        const id = nanoid(16);
        const query = {
            text: 'INSERT INTO authentication (id, refresh_token) VALUES($1, $2)',
            values: [id, refreshToken],
        };

        await this._pool.query(query);
    }

    async getRefreshToken(refreshToken) {
        const query = {
            text: 'SELECT * FROM authentication WHERE refresh_token = $1',
            values: [refreshToken],
        };

        const result = await this._pool.query(query);
        return result.rows[0] || null;
    }

    async deleteRefreshToken(refreshToken) {
        const query = {
            text: 'DELETE FROM authentication WHERE refresh_token = $1 RETURNING refresh_token',
            values: [refreshToken],
        };

        const result = await this._pool.query(query);
        return result.rows[0] || null;
    }
}

export default new AuthRepository();