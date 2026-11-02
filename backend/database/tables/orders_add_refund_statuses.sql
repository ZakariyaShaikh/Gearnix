ALTER TABLE orders
    MODIFY COLUMN status ENUM(
        'pending_payment',
        'paid',
        'failed',
        'cancelled',
        'refund_pending',
        'refunded',
        'refund_failed'
    ) NOT NULL DEFAULT 'pending_payment';