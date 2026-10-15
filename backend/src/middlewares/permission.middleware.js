import {
    checkUserPermission
} from '../models/permission.model.js';

export const requirePermission = (permissionKey) => {

    return async (req, res, next) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication is required'
                });
            }

            const permission = await checkUserPermission({
                roleId: req.user.role_id,
                permissionKey
            });

            if (!permission) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to perform this action'
                });
            }

            next();

        } catch (error) {
            next(error);
        }
    };
};