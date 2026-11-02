CREATE TABLE refunds (
    refund_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    payment_id BIGINT UNSIGNED NOT NULL,
    provider_refund_id VARCHAR(100) NULL,
    amount_paise INT UNSIGNED NOT NULL,
    status ENUM('created', 'processed', 'failed') NOT NULL DEFAULT 'created',
    reason VARCHAR(255) NULL,
    failure_reason VARCHAR(255) NULL,
    requested_by BIGINT UNSIGNED NULL,
    processed_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (refund_id),
    UNIQUE KEY uq_refunds_payment (payment_id),
    UNIQUE KEY uq_refunds_provider (provider_refund_id),
    KEY idx_refunds_order (order_id),
    CONSTRAINT chk_refunds_amount CHECK (amount_paise > 0),
    CONSTRAINT fk_refunds_order FOREIGN KEY (order_id)
        REFERENCES orders (order_id),
    CONSTRAINT fk_refunds_payment FOREIGN KEY (payment_id)
        REFERENCES payments (payment_id),
    CONSTRAINT fk_refunds_requested_by FOREIGN KEY (requested_by)
        REFERENCES users (user_id)
);