import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { uploadProductImages } from '../middlewares/upload.middleware.js';
import {
    createProduct,
    addProductImages,
    updateProduct,
    listPublicProducts,
    listAdminProducts,
    getProductDetail,
    deleteProductImage,
    setPrimaryProductImage
} from '../controllers/product.controller.js';
import {
    validateCreateProduct,
    validateProductIdParam,
    validateUpdateProduct,
    validateProductListQuery,
    validateImageIdParam
} from '../validators/product.validator.js';

const router = express.Router();

// Public list
router.get(
    '/',
    validateProductListQuery,
    listPublicProducts
);

// Admin list. Must come BEFORE '/:id', or "admin" would be read as an ID
router.get(
    '/admin',
    authenticate,
    requirePermission('product.read'),
    validateProductListQuery,
    listAdminProducts
);

// Public detail
router.get(
    '/:id',
    validateProductIdParam,
    getProductDetail
);

router.post(
    '/',
    authenticate,
    requirePermission('product.create'),
    validateCreateProduct,
    createProduct
);

router.post(
    '/:id/images',
    authenticate,
    requirePermission('product.update'),
    validateProductIdParam,
    uploadProductImages,
    addProductImages
);

router.patch(
    '/:id',
    authenticate,
    requirePermission('product.update'),
    validateProductIdParam,
    validateUpdateProduct,
    updateProduct
);

// Delete one image
router.delete(
    '/:id/images/:imageId',
    authenticate,
    requirePermission('product.update'),
    validateProductIdParam,
    validateImageIdParam,
    deleteProductImage
);

// Make one image the primary image
router.patch(
    '/:id/images/:imageId/primary',
    authenticate,
    requirePermission('product.update'),
    validateProductIdParam,
    validateImageIdParam,
    setPrimaryProductImage
);

export default router;