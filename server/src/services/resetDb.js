import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool();

async function resetDatabase() {
    try {
        console.log("Deleting data...");

        const query = `TRUNCATE users CASCADE;`;

        await pool.query(query);
        console.log("Data deleted");
    } catch (error) {
        console.error("Error resetting database", error.message);
    } finally {
        await pool.end();
    }
}

resetDatabase();