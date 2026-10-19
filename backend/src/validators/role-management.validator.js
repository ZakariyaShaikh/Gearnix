export const validateRoleIdParam = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role ID'
        });
    }

    req.params.id = id;
    next();
};

export const validateRolePermissionsBody = (req, res, next) => {
    const keys = req.body?.permission_keys;

    if (!Array.isArray(keys)) {
        return res.status(400).json({
            success: false,
            message: 'permission_keys must be a list of permission keys'
        });
    }

    if (keys.length > 50) {
        return res.status(400).json({
            success: false,
            message: 'A role can have at most 50 permissions'
        });
    }

    // Every key must look like "module.action", for example "product.read"
    const validFormat = keys.every(
        (key) => typeof key === 'string' && key.length <= 100 && /^[a-z_]+\.[a-z_]+$/.test(key)
    );

    if (!validFormat) {
        return res.status(400).json({
            success: false,
            message: 'Each permission key must look like "module.action"'
        });
    }

    // Remove duplicates, keep only the allowed field
    req.body = {
        permission_keys: [...new Set(keys)]
    };

    next();
};