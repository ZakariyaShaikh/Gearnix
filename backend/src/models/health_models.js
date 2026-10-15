import pool from "../config/db.js";

export const healthCheckModel = async () => {
    const [result] = await pool.query(
        "CALL sp_health_check()"
    );
    return result[0];
}