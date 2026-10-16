export const validateCreateProduct = (req, res, next) => {
    const { name, description, price, stock_quantity, category_ids } = req.body || {};

    // name
    if (typeof name !== 'string') {
        return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 200) {
        return res.status(400).json({
            success: false,
            message: 'Product name must be between 2 and 200 characters'
        });
    }

    // description (optional)
    let cleanDescription = null;

    if (description !== undefined && description !== null) {
        if (typeof description !== 'string') {
            return res.status(400).json({ success: false, message: 'Description must be text' });
        }

        const trimmedDescription = description.trim();

        if (trimmedDescription.length > 5000) {
            return res.status(400).json({
                success: false,
                message: 'Description must be 5000 characters or fewer'
            });
        }

        cleanDescription = trimmedDescription || null;
    }

    // price: a number with at most 2 decimals, greater than 0
    // (checked as a string, because float math like 19.99 * 100 is not exact)
    if (typeof price !== 'number' || !/^\d+(\.\d{1,2})?$/.test(String(price)) || price <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a positive number with at most 2 decimal places'
        });
    }

    // stock_quantity (optional, defaults to 0)
    let stockQuantity = 0;

    if (stock_quantity !== undefined && stock_quantity !== null) {
        if (!Number.isInteger(stock_quantity) || stock_quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock quantity must be a whole number, 0 or more'
            });
        }

        stockQuantity = stock_quantity;
    }

    // category_ids: at least one, each a positive integer, duplicates removed
    if (!Array.isArray(category_ids) || category_ids.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'At least one category is required'
        });
    }

    if (category_ids.length > 20) {
        return res.status(400).json({
            success: false,
            message: 'A product can have at most 20 categories'
        });
    }

    if (!category_ids.every((id) => Number.isInteger(id) && id > 0)) {
        return res.status(400).json({
            success: false,
            message: 'Category IDs must be positive whole numbers'
        });
    }

    const uniqueCategoryIds = [...new Set(category_ids)];

    // Hand cleaned values to the controller
    req.body.name = trimmedName;
    req.body.description = cleanDescription;
    req.body.stock_quantity = stockQuantity;
    req.body.category_ids = uniqueCategoryIds;

    next();
};

export const validateProductIdParam = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid product ID'
        });
    }

    // Replace the string with the number for later layers
    req.params.id = id;
    next();
};

export const validateUpdateProduct = (req, res, next) => {
    const body = req.body || {};

    const fields = ['name', 'description', 'price', 'stock_quantity', 'is_active', 'category_ids'];
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
        price: undefined,
        stock_quantity: undefined,
        is_active: undefined,
        category_ids: undefined
    };

    // name (optional)
    if (body.name !== undefined) {
        if (typeof body.name !== 'string') {
            return res.status(400).json({ success: false, message: 'Product name must be text' });
        }

        const trimmedName = body.name.trim();

        if (trimmedName.length < 2 || trimmedName.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Product name must be between 2 and 200 characters'
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

            if (trimmedDescription.length > 5000) {
                return res.status(400).json({
                    success: false,
                    message: 'Description must be 5000 characters or fewer'
                });
            }

            cleaned.description = trimmedDescription || null;
        }
    }

    // price (optional)
    if (body.price !== undefined) {
        if (typeof body.price !== 'number' || !/^\d+(\.\d{1,2})?$/.test(String(body.price)) || body.price <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a positive number with at most 2 decimal places'
            });
        }

        cleaned.price = body.price;
    }

    // stock_quantity (optional)
    if (body.stock_quantity !== undefined) {
        if (!Number.isInteger(body.stock_quantity) || body.stock_quantity < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock quantity must be a whole number, 0 or more'
            });
        }

        cleaned.stock_quantity = body.stock_quantity;
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

    // category_ids (optional, but if sent: at least one)
    if (body.category_ids !== undefined) {
        if (!Array.isArray(body.category_ids) || body.category_ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one category is required'
            });
        }

        if (body.category_ids.length > 20) {
            return res.status(400).json({
                success: false,
                message: 'A product can have at most 20 categories'
            });
        }

        if (!body.category_ids.every((id) => Number.isInteger(id) && id > 0)) {
            return res.status(400).json({
                success: false,
                message: 'Category IDs must be positive whole numbers'
            });
        }

        cleaned.category_ids = [...new Set(body.category_ids)];
    }

    // Replace the body with only the cleaned, allowed fields
    req.body = cleaned;

    next();
};

export const validateProductListQuery = (req, res, next) => {
    const query = req.query || {};

    // page (default 1)
    const page = query.page === undefined ? 1 : Number(query.page);

    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            success: false,
            message: 'Page must be a whole number, 1 or more'
        });
    }

    // limit (default 12, max 50)
    const limit = query.limit === undefined ? 12 : Number(query.limit);

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        return res.status(400).json({
            success: false,
            message: 'Limit must be a whole number between 1 and 50'
        });
    }

    // category (optional slug, for example "gaming")
    let categorySlug = null;

    if (query.category !== undefined && query.category !== '') {
        if (typeof query.category !== 'string' || !/^[a-z0-9-]{1,120}$/.test(query.category)) {
            return res.status(400).json({
                success: false,
                message: 'Category must be a slug, for example "gaming"'
            });
        }

        categorySlug = query.category;
    }

    // search (optional, max 100 characters)
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
    req.listQuery = { page, limit, categorySlug, search };

    next();
};

export const validateImageIdParam = (req, res, next) => {
    const imageId = Number(req.params.imageId);

    if (!Number.isInteger(imageId) || imageId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid image ID'
        });
    }

    req.params.imageId = imageId;
    next();
};