DROP PROCEDURE IF EXISTS sp_update_blog;

DELIMITER $$

CREATE PROCEDURE sp_update_blog(
    IN p_blog_id BIGINT UNSIGNED,
    IN p_title VARCHAR(200),
    IN p_slug VARCHAR(220),
    IN p_excerpt VARCHAR(500),
    IN p_update_excerpt TINYINT,
    IN p_content MEDIUMTEXT,
    IN p_cover_image VARCHAR(500),
    IN p_update_cover TINYINT,
    IN p_is_published TINYINT
)
BEGIN
    -- NULL means "keep the current value"
    UPDATE blogs
    SET title = COALESCE(p_title, title),
        slug = COALESCE(p_slug, slug),
        excerpt = IF(p_update_excerpt = 1, p_excerpt, excerpt),
        content = COALESCE(p_content, content),
        cover_image = IF(p_update_cover = 1, p_cover_image, cover_image),
        is_published = COALESCE(p_is_published, is_published),
        -- Set the publish date only the first time the post goes live
        published_at = IF(p_is_published = 1 AND published_at IS NULL, NOW(), published_at),
        updated_at = NOW()
    WHERE blog_id = p_blog_id;

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
    WHERE blog_id = p_blog_id
    LIMIT 1;
END$$

DELIMITER ;