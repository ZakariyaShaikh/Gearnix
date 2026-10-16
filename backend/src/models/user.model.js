import pool from "../config/db.js";


export const findUserByEmail = async(email) => {
    const [rows] = await pool.query(
        'CALL sp_find_user_by_email(?)' , [email]
    );
    return rows[0][0] ?? null ;
};

export const createCustomer = async ({
    roleId,
    username,
    email,
    passwordHash
}) => {
    const [rows] = await pool.query(
        'CALL sp_create_customer(?, ?, ?, ?)',
        [
            roleId,
            username,
            email,
            passwordHash
        ]
    );

    return rows[0][0] ?? null;
};

export const findUserById = async (userId) => {
    const [rows] = await pool.query(
        'CALL sp_find_user_by_id(?)',
        [userId]
    );

    return rows[0][0] ?? null;
};

export const verifyUserEmail = async (userId) => {
    const [rows] = await pool.query(
        'CALL sp_verify_user_email(?)',
        [userId]
    );

    return rows[0][0] ?? null;
};

export const findUserForLogin = async (email) => {
    const [rows] = await pool.query(
        'CALL sp_find_user_for_login(?)',
        [email]
    );

    return rows[0][0] ?? null;
};

export const findUserProfile = async (userId) => {
    const [rows] = await pool.query(
        'CALL sp_find_user_profile(?)',
        [userId]
    );

    return rows[0][0] ?? null;
};

export const getUserProfile = async (userId) => {
    const [rows] = await pool.query('CALL sp_get_user_profile(?)', [userId]);

    return rows[0][0] || null;
};

export const updateUserProfile = async (userId, username) => {
    const [rows] = await pool.query('CALL sp_update_user_profile(?, ?)', [
        userId,
        username
    ]);

    // rows[0] = result rows of the final SELECT
    return rows[0][0] || null;
};

export const getUserPasswordHash = async (userId) => {
    const [rows] = await pool.query('CALL sp_get_user_password_hash(?)', [userId]);
    return rows[0][0] || null;
};

export const updateUserPassword = async (userId, passwordHash) => {
    const [rows] = await pool.query('CALL sp_update_user_password(?, ?)', [
        userId,
        passwordHash
    ]);
    return Number(rows[0][0].affected_rows) > 0;
};

export const updateUserProfileImage = async (userId, profileImagePath) => {
    const [rows] = await pool.query('CALL sp_update_user_profile_image(?, ?)', [
        userId,
        profileImagePath
    ]);
    return rows[0][0] || null;
};

export const getAccountDeletionInfo = async (userId) => {
    const [rows] = await pool.query('CALL sp_get_account_deletion_info(?)', [userId]);
    return rows[0][0] || null;
};

export const softDeleteUser = async (userId) => {
    const [rows] = await pool.query('CALL sp_soft_delete_user(?)', [userId]);
    return Number(rows[0][0].affected_rows) > 0;
};

export const getUserAuthState = async (userId) => {
    const [rows] = await pool.query('CALL sp_get_user_auth_state(?)', [userId]);
    return rows[0][0] || null;
};

export const listUsers = async ({ roleId, search, limit, offset }) => {
    const [rows] = await pool.query('CALL sp_list_users(?, ?, ?, ?)', [
        roleId ?? null,
        search ?? null,
        limit,
        offset
    ]);

    // rows[0] = the count result set, rows[1] = the page of users
    return {
        total: Number(rows[0][0].total),
        items: rows[1]
    };
};

export const changeUserRole = async ({ targetUserId, newRoleId, changedBy, reason }) => {
    const [rows] = await pool.query('CALL sp_change_user_role(?, ?, ?, ?)', [
        targetUserId,
        newRoleId,
        changedBy,
        reason ?? null
    ]);

    // One row: the updated user with their new role
    return rows[0][0] || null;
};