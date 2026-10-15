import pool from '../config/db.js';

export const createCategory = async (name, slug, description) => {
    const [rows] = await pool.query('CALL sp_create_category(?, ?, ?)', [
        name,
        slug,
        description
    ]);

    // rows[0] = result rows, rows[0][0] = the newly created category
    return rows[0][0];
};

export const getCategories = async (includeInactive) => {
    const [rows] = await pool.query('CALL sp_get_categories(?)', [
        includeInactive ? 1 : 0
    ]);

    // rows[0] = the array of categories
    return rows[0];
};

export const updateCategory = async ({
    categoryId,
    name,
    slug,
    description,
    descriptionProvided,
    isActive
}) => {
    // `?? null` turns "not sent" into NULL, which the procedure reads as "keep"
    const [rows] = await pool.query('CALL sp_update_category(?, ?, ?, ?, ?, ?)', [
        categoryId,
        name ?? null,
        slug ?? null,
        description ?? null,
        descriptionProvided ? 1 : 0,
        isActive ?? null
    ]);

    // No row means the category ID doesn't exist
    return rows[0][0] || null;
};