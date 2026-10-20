DROP PROCEDURE IF EXISTS sp_create_blog;

DELIMITER $$

CREATE PROCEDURE sp_create_blog(
    IN p_title VARCHAR(200),
    IN p_slug VARCHAR(220),
    IN p_excerpt VARCHAR(500),
    IN p_content MEDIUMTEXT,
    IN p_cover_image VARCHAR(500),
    IN p_is_published TINYINT,
    IN p_created_by BIGINT UNSIGNED
)
BEGIN
    INSERT INTO blogs
        (title, slug, excerpt, content, cover_image, is_published, published_at, created_by)
    VALUES
        (p_title, p_slug, p_excerpt, p_content, p_cover_image, p_is_published,
         IF(p_is_published = 1, NOW(), NULL),
         p_created_by);

    SELECT
        blog_id,
        title,
        slug,
        excerpt,
        content,
        cover_image,
        is_published,
        published_at,
        created_by,
        created_at,
        updated_at
    FROM blogs
    WHERE blog_id = LAST_INSERT_ID();
END$$

DELIMITER ;