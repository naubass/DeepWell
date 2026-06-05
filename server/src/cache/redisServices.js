import { createClient } from "redis";

class CacheService {
    constructor() {
        this._client = createClient({
            socket: {
                host: process.env.REDIS_HOST,
            },
        });

        // Handler error koneksi Redis — tangkap agar tidak silent fail
        this._client.on('error', (error) => {
            console.error('[CacheService] Redis client error:', error.message);
        });

        // .catch() memastikan jika koneksi awal gagal, error tetap terlog
        // dan tidak mejadi unhandled promise rejection
        this._client.connect().catch((error) => {
            console.error('[CacheService] Failed to connect to Redis:', error.message);
        });
    }

    async set(key, value, expirationTime = 3600) {
        await this._client.set(key, value, { EX: expirationTime });
    }

    async get(key) {
        const result = await this._client.get(key);

        if (result === null) throw new Error('cache not found');

        return result;
    }

    async delete(key) {
        await this._client.del(key);
    }
}

export default new CacheService();