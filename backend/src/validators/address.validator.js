const hasField = (body, key) => Object.prototype.hasOwnProperty.call(body, key);

// Reads one text field. Returns { value } or { error }
const readText = (body, key, label, { min, max, required, partial }) => {
    if (!hasField(body, key)) {
        if (required && !partial) {
            return { error: `${label} is required` };
        }
        return { value: undefined };
    }

    if (body[key] === null) {
        if (required) {
            return { error: `${label} cannot be empty` };
        }
        return { value: null };
    }

    if (typeof body[key] !== 'string') {
        return { error: `${label} must be text` };
    }

    const trimmed = body[key].trim();

    if (trimmed.length < min || trimmed.length > max) {
        return { error: `${label} must be between ${min} and ${max} characters` };
    }

    return { value: trimmed };
};

// Accepts 9876543210, +91 98765 43210 or 98765-43210; returns the 10 digits or null
const normalizePhone = (value) => {
    let digits = value.replace(/[\s-]/g, '');

    if (digits.startsWith('+91')) {
        digits = digits.slice(3);
    }

    return /^[6-9]\d{9}$/.test(digits) ? digits : null;
};

const buildAddress = (body, { partial }) => {
    const fields = {};

    const textFields = [
        ['full_name', 'Full name', 2, 100, true],
        ['line1', 'Address line 1', 3, 200, true],
        ['city', 'City', 2, 100, true],
        ['state', 'State', 2, 100, true],
        ['line2', 'Address line 2', 0, 200, false],
        ['label', 'Label', 0, 50, false]
    ];

    for (const [key, label, min, max, required] of textFields) {
        const result = readText(body, key, label, { min, max, required, partial });

        if (result.error) {
            return { error: result.error };
        }

        // Optional fields that were sent as empty become NULL
        fields[key] = result.value === undefined ? undefined : result.value || null;
        fields[`${key}_provided`] = hasField(body, key);
    }

    if (!partial || hasField(body, 'phone')) {
        const phone = typeof body.phone === 'string' ? normalizePhone(body.phone) : null;

        if (!phone) {
            return { error: 'Phone must be a valid 10-digit Indian mobile number' };
        }

        fields.phone = phone;
    }

    if (!partial || hasField(body, 'postal_code')) {
        if (typeof body.postal_code !== 'string' || !/^\d{6}$/.test(body.postal_code.trim())) {
            return { error: 'Postal code must be a 6-digit PIN code' };
        }

        fields.postal_code = body.postal_code.trim();
    }

    if (hasField(body, 'country_code')) {
        if (body.country_code !== 'IN') {
            return { error: 'Only Indian addresses (country_code "IN") are supported right now' };
        }

        fields.country_code = 'IN';
    }

    if (hasField(body, 'is_default')) {
        if (typeof body.is_default !== 'boolean') {
            return { error: 'is_default must be true or false' };
        }

        if (partial && body.is_default === false) {
            return { error: 'To change your default address, set another address as default' };
        }

        fields.make_default = body.is_default ? 1 : 0;
    }

    return { fields };
};

export const validateAddressIdParam = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid address ID' });
    }

    req.params.id = id;
    next();
};

export const validateCreateAddress = (req, res, next) => {
    const result = buildAddress(req.body || {}, { partial: false });

    if (result.error) {
        return res.status(400).json({ success: false, message: result.error });
    }

    req.body = result.fields;
    next();
};

export const validateUpdateAddress = (req, res, next) => {
    const body = req.body || {};
    const fieldNames = [
        'label', 'full_name', 'phone', 'line1', 'line2',
        'city', 'state', 'postal_code', 'country_code', 'is_default'
    ];

    if (!fieldNames.some((field) => hasField(body, field))) {
        return res.status(400).json({
            success: false,
            message: 'Send at least one field to update'
        });
    }

    const result = buildAddress(body, { partial: true });

    if (result.error) {
        return res.status(400).json({ success: false, message: result.error });
    }

    req.body = result.fields;
    next();
};