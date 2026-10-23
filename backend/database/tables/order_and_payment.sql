CREATE TABLE orders (
    order_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_number VARCHAR(30) NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('pending_payment', 'paid', 'failed', 'cancelled') NOT NULL DEFAULT 'pending_payment',
    subtotal DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    ship_full_name VARCHAR(100) NOT NULL,
    ship_phone VARCHAR(15) NOT NULL,
    ship_line1 VARCHAR(200) NOT NULL,
    ship_line2 VARCHAR(200) NULL,
    ship_city VARCHAR(100) NOT NULL,
    ship_state VARCHAR(100) NOT NULL,
    ship_postal_code VARCHAR(10) NOT NULL,
    ship_country_code CHAR(2) NOT NULL DEFAULT 'IN',
    paid_at DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (order_id),
    UNIQUE KEY uq_orders_number (order_number),
    KEY idx_orders_user (user_id, created_at),
    KEY idx_orders_status (status),
    CONSTRAINT chk_orders_total CHECK (total >= 0),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id)
        REFERENCES users (user_id)
);

CREATE TABLE order_items (
    order_item_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    line_total DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_item_id),
    KEY idx_order_items_order (order_id),
    KEY idx_order_items_product (product_id),
    CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
        REFERENCES orders (order_id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
        REFERENCES products (product_id)
);

CREATE TABLE payments (
    payment_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    order_id BIGINT UNSIGNED NOT NULL,
    provider ENUM('razorpay') NOT NULL DEFAULT 'razorpay',
    provider_order_id VARCHAR(100) NOT NULL,
    provider_payment_id VARCHAR(100) NULL,
    amount_paise INT UNSIGNED NOT NULL,
    status ENUM('created', 'paid', 'failed') NOT NULL DEFAULT 'created',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (payment_id),
    UNIQUE KEY uq_payments_provider_order (provider_order_id),
    UNIQUE KEY uq_payments_provider_payment (provider_payment_id),
    KEY idx_payments_order (order_id),
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id)
        REFERENCES orders (order_id)
);