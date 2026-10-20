DROP PROCEDURE IF EXISTS sp_get_blog_by_id;

DELIMITER $$

CREATE PROCEDURE sp_get_blog_by_id(
    IN p_blog_id BIGINT UNSIGNED
)
BEGIN
    SELECT
        b.blog_id,
        b.title,
        b.slug,
        b.excerpt,
        b.content,
        b.cover_image,
        b.is_published,
        b.published_at,
        b.created_by,
        b.created_at,
        b.updated_at
    FROM blogs b
    WHERE b.blog_id = p_blog_id
    LIMIT 1;
END$$

DELIMITER ;