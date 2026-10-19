CREATE TABLE blogs (
    blog_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL,
    excerpt VARCHAR(500) NULL,
    content MEDIUMTEXT NOT NULL,
    cover_image VARCHAR(500) NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 0,
    published_at DATETIME NULL,
    created_by BIGINT UNSIGNED NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (blog_id),
    UNIQUE KEY uq_blogs_slug (slug),
    KEY idx_blogs_published (is_published, published_at),
    KEY idx_blogs_created_by (created_by),
    CONSTRAINT fk_blogs_created_by FOREIGN KEY (created_by)
        REFERENCES users (user_id)
);