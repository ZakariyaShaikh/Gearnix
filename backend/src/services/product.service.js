import {
    countActiveCategories,
    createProduct,
    getProductById,
    addProductImages,
    updateProduct,
    listProducts,
    getProductDetail
} from '../models/product.model.js';
import { slugify } from '../utils/slug.utils.js';
import {
    PRODUCT_IMAGE_URL_PREFIX,
    deleteProductImageFile
} from '../utils/file.utils.js';

export const createProductService = async (userId, input) => {
    const slug = slugify(input.name);

    if (!slug) {
        const error = new Error('Product name must contain letters or numbers');
        error.statusCode = 400;
        throw error;
    }

    // Every category must exist and be active
    const activeCount = await countActiveCategories(input.category_ids);

    if (activeCount !== input.category_ids.length) {
        const error = new Error('One or more categories do not exist or are inactive');
        error.statusCode = 400;
        throw error;
    }

    try {
        return await createProduct({
            name: input.name,
            slug,
            description: input.description,
            price: input.price,
            stockQuantity: input.stock_quantity,
            createdBy: userId,
            categoryIds: input.category_ids
        });
    } catch (err) {
        // UNIQUE slug was violated
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('A product with this name already exists');
            error.statusCode = 409;
            throw error;
        }

        // A category link failed (rare, since we checked above)
        if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.sqlMessage?.includes('product_categories')) {
            const error = new Error('One or more categories are invalid');
            error.statusCode = 400;
            throw error;
        }

        throw err;
    }
};

export const addProductImagesService = async (productId, files) => {
    // Filenames are already saved on disk by multer, so build their public paths
    const imageUrls = files.map((file) => `${PRODUCT_IMAGE_URL_PREFIX}${file.filename}`);

    try {
        const product = await getProductById(productId);

        if (!product) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        return await addProductImages(productId, imageUrls);
    } catch (err) {
        // The request failed, so the uploaded files would be orphaned: remove them
        await Promise.all(imageUrls.map((url) => deleteProductImageFile(url)));

        // Two simultaneous uploads raced for the primary image slot
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('Image upload conflicted with another change, please try again');
            error.statusCode = 409;
            throw error;
        }

        throw err;
    }
};

export const updateProductService = async (productId, input) => {
    // The product must exist
    const existing = await getProductById(productId);

    if (!existing) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    // A new name means a new slug
    let slug;

    if (input.name !== undefined) {
        slug = slugify(input.name);

        if (!slug) {
            const error = new Error('Product name must contain letters or numbers');
            error.statusCode = 400;
            throw error;
        }
    }

    // If categories were sent, every one must be active
    if (input.category_ids !== undefined) {
        const activeCount = await countActiveCategories(input.category_ids);

        if (activeCount !== input.category_ids.length) {
            const error = new Error('One or more categories do not exist or are inactive');
            error.statusCode = 400;
            throw error;
        }
    }

    try {
        const result = await updateProduct({
            productId,
            name: input.name,
            slug,
            description: input.description,
            descriptionProvided: input.description_provided,
            price: input.price,
            stockQuantity: input.stock_quantity,
            // Convert true/false to the 1/0 the procedure expects
            isActive: input.is_active === undefined ? undefined : input.is_active ? 1 : 0,
            categoryIds: input.category_ids
        });

        if (!result) {
            const error = new Error('Product not found');
            error.statusCode = 404;
            throw error;
        }

        return result;
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            const error = new Error('A product with this name already exists');
            error.statusCode = 409;
            throw error;
        }

        if (err.code === 'ER_NO_REFERENCED_ROW_2' && err.sqlMessage?.includes('product_categories')) {
            const error = new Error('One or more categories are invalid');
            error.statusCode = 400;
            throw error;
        }

        // Safety net: the validator already blocks this, but the database has the final say
        if (err.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
            const error = new Error('Price must be greater than 0');
            error.statusCode = 400;
            throw error;
        }

        throw err;
    }
};

export const listProductsService = async ({
    includeInactive,
    categorySlug,
    search,
    page,
    limit
}) => {
    const offset = (page - 1) * limit;

    const { total, items } = await listProducts({
        includeInactive,
        categorySlug,
        search,
        limit,
        offset
    });

    return {
        items,
        pagination: {
            page,
            limit,
            total,
            total_pages: Math.ceil(total / limit)
        }
    };
};

export const getProductDetailService = async (productId) => {
    const detail = await getProductDetail(productId);

    if (!detail) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    return detail;
};