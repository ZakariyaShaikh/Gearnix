use gearnix;

CREATE TABLE otp_verifications (
    otp_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    purpose VARCHAR(40) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    attempt_count INT UNSIGNED NOT NULL DEFAULT 0,
    max_attempts INT UNSIGNED NOT NULL DEFAULT 5,
    verified_at DATETIME NULL,
    invalidated_at DATETIME NULL AFTER verified_at,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (otp_id),
    KEY idx_otp_user_purpose (user_id, purpose),
    KEY idx_otp_expires_at (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);