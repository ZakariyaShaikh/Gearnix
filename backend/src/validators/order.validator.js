export const validateOrderIdParam = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid order ID' });
    }

    req.params.id = id;
    next();
};

export const validateCheckout = (req, res, next) => {
    const addressId = req.body?.address_id;

    if (!Number.isInteger(addressId) || addressId <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Address ID must be a positive whole number'
        });
    }

    // Only the address is accepted. Prices, totals and items come from the cart
    req.body = { address_id: addressId };
    next();
};

export const validateVerifyPayment = (req, res, next) => {
    const body = req.body || {};
    const fields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'];

    for (const field of fields) {
        if (typeof body[field] !== 'string' || body[field].trim() === '' || body[field].length > 100) {
            return res.status(400).json({
                success: false,
                message: `${field} is required`
            });
        }
    }

    req.body = {
        razorpay_order_id: body.razorpay_order_id.trim(),
        razorpay_payment_id: body.razorpay_payment_id.trim(),
        razorpay_signature: body.razorpay_signature.trim()
    };

    next();
};

export const validateOrderListQuery = (req, res, next) => {
    const query = req.query || {};

    const page = query.page === undefined ? 1 : Number(query.page);

    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            success: false,
            message: 'Page must be a whole number, 1 or more'
        });
    }

    const limit = query.limit === undefined ? 10 : Number(query.limit);

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        return res.status(400).json({
            success: false,
            message: 'Limit must be a whole number between 1 and 50'
        });
    }

    req.listQuery = { page, limit };
    next();
};

export const validateAdminOrderListQuery = (req, res, next) => {
    const query = req.query || {};

    const page = query.page === undefined ? 1 : Number(query.page);

    if (!Number.isInteger(page) || page < 1) {
        return res.status(400).json({
            success: false,
            message: 'Page must be a whole number, 1 or more'
        });
    }

    const limit = query.limit === undefined ? 10 : Number(query.limit);

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        return res.status(400).json({
            success: false,
            message: 'Limit must be a whole number between 1 and 50'
        });
    }

    const validStatuses = ['pending_payment', 'paid', 'failed', 'cancelled'];
    const status = query.status === undefined ? null : String(query.status).trim();

    if (status !== null && status !== '' && !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: `Status must be one of: ${validStatuses.join(', ')}`
        });
    }

    const search = query.search === undefined ? null : String(query.search).trim();

    if (search !== null && search.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Search must be at most 100 characters'
        });
    }

    req.listQuery = { page, limit, status: status || null, search: search || null };
    next();
};