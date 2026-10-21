import pool from '../config/db.js';

export const listAddresses = async (userId) => {
    const [rows] = await pool.query('CALL sp_list_addresses(?)', [userId]);

    return rows[0];
};

export const createAddress = async ({
    userId,
    label,
    fullName,
    phone,
    line1,
    line2,
    city,
    state,
    postalCode,
    countryCode,
    makeDefault
}) => {
    const [rows] = await pool.query(
        'CALL sp_add_address(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            userId,
            label ?? null,
            fullName,
            phone,
            line1,
            line2 ?? null,
            city,
            state,
            postalCode,
            countryCode ?? null,
            makeDefault ? 1 : 0
        ]
    );

    return rows[0][0];
};

export const updateAddress = async ({
    userId,
    addressId,
    label,
    labelProvided,
    fullName,
    phone,
    line1,
    line2,
    line2Provided,
    city,
    state,
    postalCode,
    countryCode,
    makeDefault
}) => {
    const [rows] = await pool.query(
        'CALL sp_update_address(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            userId,
            addressId,
            label ?? null,
            labelProvided ? 1 : 0,
            fullName ?? null,
            phone ?? null,
            line1 ?? null,
            line2 ?? null,
            line2Provided ? 1 : 0,
            city ?? null,
            state ?? null,
            postalCode ?? null,
            countryCode ?? null,
            makeDefault === 1 ? 1 : null
        ]
    );

    return rows[0][0];
};

export const deleteAddress = async (userId, addressId) => {
    const [rows] = await pool.query('CALL sp_delete_address(?, ?)', [userId, addressId]);

    // One row: the new default's ID, or NULL if none was needed
    return rows[0][0];
};