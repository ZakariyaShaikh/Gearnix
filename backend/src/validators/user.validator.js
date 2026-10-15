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