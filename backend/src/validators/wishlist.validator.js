export const validateWishlistProductParam = (req, res, next) => {
    const id = Number(req.params.productId);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    req.params.productId = id;
    next();
};

export const validateAddWishlistItem = (req, res, next) => {
    const body = req.body || {};

    if (!Number.isInteger(body.product_id) || body.product_id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Product ID must be a positive whole number'
        });
    }

    // Keep only the product ID. Everything else is read from the database
    req.body = { product_id: body.product_id };

    next();
};