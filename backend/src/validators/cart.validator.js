const MAX_QUANTITY_PER_LINE = 99;

const isValidQuantity = (value) =>
    Number.isInteger(value) && value >= 1 && value <= MAX_QUANTITY_PER_LINE;

export const validateCartProductParam = (req, res, next) => {
    const id = Number(req.params.productId);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    req.params.productId = id;
    next();
};

export const validateAddCartItem = (req, res, next) => {
    const body = req.body || {};

    if (!Number.isInteger(body.product_id) || body.product_id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Product ID must be a positive whole number'
        });
    }

    if (!isValidQuantity(body.quantity)) {
        return res.status(400).json({
            success: false,
            message: `Quantity must be a whole number between 1 and ${MAX_QUANTITY_PER_LINE}`
        });
    }

    // Keep only the allowed fields. Prices and availability are never accepted from the client
    req.body = {
        product_id: body.product_id,
        quantity: body.quantity
    };

    next();
};

export const validateUpdateCartItem = (req, res, next) => {
    const body = req.body || {};

    if (!isValidQuantity(body.quantity)) {
        return res.status(400).json({
            success: false,
            message: `Quantity must be a whole number between 1 and ${MAX_QUANTITY_PER_LINE}`
        });
    }

    req.body = { quantity: body.quantity };
    next();
};