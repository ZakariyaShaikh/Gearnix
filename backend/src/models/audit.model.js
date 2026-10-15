import pool from '../config/db.js';

export const createAuditLog = async ({
    actorUserId,
    actionKey,
    entityType,
    entityId,
    oldData,
    newData,
    ipAddress,
    userAgent
}) => {
    const [rows] = await pool.query(
        'CALL sp_create_audit_log(?, ?, ?, ?, ?, ?, ?, ?)',
        [
            actorUserId,
            actionKey,
            entityType,
            entityId,
            oldData,
            newData,
            ipAddress,
            userAgent
        ]
    );

    return rows[0][0] ?? null;
};

export const getAuditLogs = async () => {
    const [rows] = await pool.query(
        'CALL sp_get_audit_logs()'
    );

    return rows[0] ?? [];
};