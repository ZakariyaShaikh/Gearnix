DROP PROCEDURE IF EXISTS sp_get_blog_by_slug;

DELIMITER $$

CREATE PROCEDURE sp_get_blog_by_slug(
    IN p_slug VARCHAR(220)
)
BEGIN
    SELECT
        b.blog_id,
        b.title,
        b.slug,
        b.excerpt,
        b.content,
        b.cover_image,
        b.published_at,
        b.created_at,
        b.updated_at,
        u.username AS author_name
    FROM blogs b
    INNER JOIN users u ON u.user_id = b.created_by
    WHERE b.slug = p_slug
      AND b.is_published = 1
    LIMIT 1;
END$$

DELIMITER ;