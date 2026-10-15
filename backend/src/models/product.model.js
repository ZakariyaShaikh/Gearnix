import pool from '../config/db.js';

// Returns how many of the given IDs are existing, active categories
export const countActiveCategories = async (categoryIds) => {
    const [rows] = await pool.query('CALL sp_count_active_categories(?)', [
        JSON.stringify(categoryIds)
    ]);

    return Number(rows[0][0].active_count);
};

export const createProduct = async ({
    name,
    slug,
    description,
    price,
    stockQuantity,
    createdBy,
    categoryIds
}) => {
    const [rows] = await pool.query(
        'CALL sp_create_product(?, ?, ?, ?, ?, ?, ?)',
        [
            name,
            slug,
            description,
            price,
            stockQuantity,
            createdBy,
            JSON.stringify(categoryIds)
        ]
    );

    // rows[0] = product rows, rows[1] = category rows
    return {
        product: rows[0][0],
        categories: rows[1]
    };
};

export const getProductById = async (productId) => {
    const [rows] = await pool.query('CALL sp_get_product_by_id(?)', [productId]);

    return rows[0][0] || null;
};

export const addProductImages = async (productId, imageUrls) => {
    const [rows] = await pool.query('CALL sp_add_product_images(?, ?)', [
        productId,
        JSON.stringify(imageUrls)
    ]);

    // One result set: rows[0] = the product's images
    return rows[0];
};

export const updateProduct = async ({
    productId,
    name,
    slug,
    description,
    descriptionProvided,
    price,
    stockQuantity,
    isActive,
    categoryIds
}) => {
    // `?? null` turns undefined (field not sent) into NULL, which the procedure reads as "keep"
    const [rows] = await pool.query(
        'CALL sp_update_product(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            productId,
            name ?? null,
            slug ?? null,
            description ?? null,
            descriptionProvided ? 1 : 0,
            price ?? null,
            stockQuantity ?? null,
            isActive ?? null,
            categoryIds ? JSON.stringify(categoryIds) : null
        ]
    );

    // No product row means the ID doesn't exist
    if (!rows[0][0]) {
        return null;
    }

    // rows[0] = product rows, rows[1] = category rows
    return {
        product: rows[0][0],
        categories: rows[1]
    };
};

export const listProducts = async ({
    includeInactive,
    categorySlug,
    search,
    limit,
    offset
}) => {
    const [rows] = await pool.query('CALL sp_list_products(?, ?, ?, ?, ?)', [
        includeInactive ? 1 : 0,
        categorySlug ?? null,
        search ?? null,
        limit,
        offset
    ]);

    // rows[0] = the count result set, rows[1] = the page of products
    return {
        total: Number(rows[0][0].total),
        items: rows[1]
    };
};

export const getProductDetail = async (productId) => {
    const [rows] = await pool.query('CALL sp_get_product_detail(?)', [productId]);

    // No product row means the ID doesn't exist or the product is hidden
    const product = rows[0][0];

    if (!product) {
        return null;
    }

    return {
        product,
        categories: rows[1],
        images: rows[2]
    };
};