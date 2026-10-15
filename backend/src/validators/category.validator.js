export const validateCreateCategory = (req, res, next) => {
    const { name, description } = req.body || {};

    if (typeof name !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Category name is required'
        });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Category name must be between 2 and 100 characters'
        });
    }

    if (!/[a-zA-Z0-9]/.test(trimmedName)) {
        return res.status(400).json({
            success: false,
            message: 'Category name must contain at least one letter or number'
        });
    }

    let cleanDescription = null;

    if (description !== undefined && description !== null) {
        if (typeof description !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Description must be text'
            });
        }

        const trimmedDescription = description.trim();

        if (trimmedDescription.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Description must be 500 characters or fewer'
            });
        }

        cleanDescription = trimmedDescription || null;
    }

    // Hand cleaned values to the controller
    req.body.name = trimmedName;
    req.body.description = cleanDescription;

    next();
};

export const validateCategoryIdParam = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid category ID'
        });
    }

    req.params.id = id;
    next();
};

export const validateUpdateCategory = (req, res, next) => {
    const body = req.body || {};

    const fields = ['name', 'description', 'is_active'];
    const sentFields = fields.filter((field) => Object.prototype.hasOwnProperty.call(body, field));

    if (sentFields.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Send at least one field to update'
        });
    }

    const cleaned = {
        name: undefined,
        description: undefined,
        description_provided: false,
        is_active: undefined
    };

    // name (optional)
    if (body.name !== undefined) {
        if (typeof body.name !== 'string') {
            return res.status(400).json({ success: false, message: 'Category name must be text' });
        }

        const trimmedName = body.name.trim();

        if (trimmedName.length < 2 || trimmedName.length > 100) {
            return res.status(400).json({
                success: false,
                message: 'Category name must be between 2 and 100 characters'
            });
        }

        if (!/[a-zA-Z0-9]/.test(trimmedName)) {
            return res.status(400).json({
                success: false,
                message: 'Category name must contain at least one letter or number'
            });
        }

        cleaned.name = trimmedName;
    }

    // description (optional, null clears it)
    if (Object.prototype.hasOwnProperty.call(body, 'description')) {
        cleaned.description_provided = true;

        if (body.description !== null) {
            if (typeof body.description !== 'string') {
                return res.status(400).json({ success: false, message: 'Description must be text' });
            }

            const trimmedDescription = body.description.trim();

            if (trimmedDescription.length > 500) {
                return res.status(400).json({
                    success: false,
                    message: 'Description must be 500 characters or fewer'
                });
            }

            cleaned.description = trimmedDescription || null;
        }
    }

    // is_active (optional, must be true or false)
    if (body.is_active !== undefined) {
        if (typeof body.is_active !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'is_active must be true or false'
            });
        }

        cleaned.is_active = body.is_active;
    }

    // Replace the body with only the allowed, cleaned fields
    req.body = cleaned;

    next();
};