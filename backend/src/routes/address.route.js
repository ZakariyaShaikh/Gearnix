import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import {
    listAddresses,
    createAddress,
    updateAddress,
    deleteAddress
} from '../controllers/address.controller.js';
import {
    validateAddressIdParam,
    validateCreateAddress,
    validateUpdateAddress
} from '../validators/address.validator.js';

const router = express.Router();

router.get('/', authenticate, requirePermission('address.manage'), listAddresses);

router.post(
    '/',
    authenticate,
    requirePermission('address.manage'),
    validateCreateAddress,
    createAddress
);

router.patch(
    '/:id',
    authenticate,
    requirePermission('address.manage'),
    validateAddressIdParam,
    validateUpdateAddress,
    updateAddress
);

router.delete(
    '/:id',
    authenticate,
    requirePermission('address.manage'),
    validateAddressIdParam,
    deleteAddress
);

export default router;