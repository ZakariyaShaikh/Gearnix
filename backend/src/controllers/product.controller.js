import {
    createProductService,
    addProductImagesService,
    updateProductService,
    listProductsService,
    getProductDetailService 
} from '../services/product.service.js';

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : 'Internal server error'
    });
};

export const createProduct = async (req, res) => {
    try {
        // Identity from the verified JWT only
        const userId = req.user.user_id;

        const { product, categories } = await createProductService(userId, req.body);

        return res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {
                ...product,
                categories
            }
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const addProductImages = async (req, res) => {
    try {
        // Already validated as a positive integer by validateProductIdParam
        const productId = req.params.id;

        // req.files was filled by uploadProductImages
        const images = await addProductImagesService(productId, req.files);

        return res.status(201).json({
            success: true,
            message: 'Product images added successfully',
            data: images
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const { product, categories } = await updateProductService(productId, req.body);

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: {
                ...product,
                categories
            }
        });
    } catch (error) {
        return sendError(res, error);
    }
};

// Public: visible products only
export const listPublicProducts = async (req, res) => {
    try {
        const result = await listProductsService({
            includeInactive: false,
            ...req.listQuery
        });

        return res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};

// Admin: includes hidden products
export const listAdminProducts = async (req, res) => {
    try {
        const result = await listProductsService({
            includeInactive: true,
            ...req.listQuery
        });

        return res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: result
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const getProductDetail = async (req, res) => {
    try {
        // Already validated as a positive integer by validateProductIdParam
        const detail = await getProductDetailService(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            data: {
                ...detail.product,
                categories: detail.categories,
                images: detail.images
            }
        });
    } catch (error) {
        return sendError(res, error);
    }
};