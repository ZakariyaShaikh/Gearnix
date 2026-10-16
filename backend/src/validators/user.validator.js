export const validateUpdateProfile = (req, res, next) => {
    const { username } = req.body;

    if (typeof username !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Username is required'
        });
    }

    const trimmed = username.trim();

    if (trimmed.length < 3 || trimmed.length > 50) {
        return res.status(400).json({
            success: false,
            message: 'Username must be between 3 and 50 characters'
        });
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return res.status(400).json({
            success: false,
            message: 'Username can only contain letters, numbers, and underscores'
        });
    }

    // Store the cleaned value for the controller
    req.body.username = trimmed;
    next();
};

export const validateChangePassword = (req, res, next) => {
    const { current_password, new_password, confirm_password } = req.body;

    if (
        typeof current_password !== 'string' ||
        typeof new_password !== 'string' ||
        typeof confirm_password !== 'string' ||
        !current_password ||
        !new_password ||
        !confirm_password
    ) {
        return res.status(400).json({
            success: false,
            message: 'Current password, new password and confirm password are required'
        });
    }

    // bcrypt only uses the first 72 bytes, so we cap the length
    if (new_password.length < 8 || new_password.length > 72) {
        return res.status(400).json({
            success: false,
            message: 'New password must be between 8 and 72 characters'
        });
    }

    if (new_password !== confirm_password) {
        return res.status(400).json({
            success: false,
            message: 'New password and confirm password do not match'
        });
    }

    next();
};

export const validateDeleteAccount = (req, res, next) => {
    const { password } = req.body || {};

    if (typeof password !== 'string' || !password) {
        return res.status(400).json({
            success: false,
            message: 'Password is required to delete your account'
        });
    }

    next();
};

export const validateUserListQuery = (req, res, next) => {
    const query = req.query || {};

    // page (default 1)
    const page = query.page === undefined ? 1 : Number(query.page);

    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            success: false,
            message: 'Page must be a whole number, 1 or more'
        });
    }

    // limit (default 20, max 100)
    const limit = query.limit === undefined ? 20 : Number(query.limit);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({
            success: false,
            message: 'Limit must be a whole number between 1 and 100'
        });
    }

    // role_id (optional filter)
    let roleId = null;

    if (query.role_id !== undefined && query.role_id !== '') {
        const parsedRoleId = Number(query.role_id);

        if (!Number.isInteger(parsedRoleId) || parsedRoleId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Role ID must be a positive whole number'
            });
        }

        roleId = parsedRoleId;
    }

    // search (optional, matches email or username)
    let search = null;

    if (query.search !== undefined) {
        if (typeof query.search !== 'string') {
            return res.status(400).json({ success: false, message: 'Search must be text' });
        }

        const trimmedSearch = query.search.trim();

        if (trimmedSearch.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Search must be 100 characters or fewer'
            });
        }

        search = trimmedSearch || null;
    }

    // Cleaned values for the controller
    req.listQuery = { page, limit, roleId, search };

    next();
};

export const validateUserIdParam = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid user ID'
        });
    }

    req.params.id = id;
    next();
};

export const validateChangeUserRole = (req, res, next) => {
    const body = req.body || {};

    // role_id is required
    if (!Number.isInteger(body.role_id) || body.role_id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Role ID must be a positive whole number'
        });
    }

    // reason is optional
    let reason = null;

    if (body.reason !== undefined && body.reason !== null) {
        if (typeof body.reason !== 'string') {
            return res.status(400).json({ success: false, message: 'Reason must be text' });
        }

        const trimmedReason = body.reason.trim();

        if (trimmedReason.length > 255) {
            return res.status(400).json({
                success: false,
                message: 'Reason must be 255 characters or fewer'
            });
        }

        reason = trimmedReason || null;
    }

    // Keep only the allowed fields
    req.body = {
        role_id: body.role_id,
        reason
    };

    next();
};