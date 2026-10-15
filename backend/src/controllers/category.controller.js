import {
    createCategoryService,
    getCategoriesService,
    updateCategoryService
} from '../services/category.service.js';

const sendError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        success: false,
        message: error.statusCode ? error.message : 'Internal server error'
    });
};

export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        const category = await createCategoryService({ name, description });

        return res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        return sendError(res, error);
    }
};

// Public: active categories only
export const getActiveCategories = async (req, res) => {
    try {
        const categories = await getCategoriesService({ includeInactive: false });

        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories
        });
    } catch (error) {
        return sendError(res, error);
    }
};

// Admin: includes inactive categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await getCategoriesService({ includeInactive: true });

        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories
        });
    } catch (error) {
        return sendError(res, error);
    }
};

export const updateCategory = async (req, res) => {
    try {
        // Already validated as a positive integer by validateCategoryIdParam
        const category = await updateCategoryService(req.params.id, req.body);

        return res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        return sendError(res, error);
    }
};