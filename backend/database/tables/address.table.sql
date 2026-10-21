CREATE TABLE addresses (
    address_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    label VARCHAR(50) NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    line1 VARCHAR(200) NOT NULL,
    line2 VARCHAR(200) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    country_code CHAR(2) NOT NULL DEFAULT 'IN',
    is_default TINYINT(1) NOT NULL DEFAULT 0,
    default_marker TINYINT GENERATED ALWAYS AS (IF(is_default = 1, 1, NULL)) STORED,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (address_id),
    UNIQUE KEY uq_addresses_one_default (user_id, default_marker),
    KEY idx_addresses_user (user_id),
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);