DROP PROCEDURE IF EXISTS sp_list_blogs;

DELIMITER $$

CREATE PROCEDURE sp_list_blogs(
    IN p_include_drafts TINYINT,
    IN p_search VARCHAR(100),
    IN p_limit INT UNSIGNED,
    IN p_offset INT UNSIGNED
)
BEGIN
    -- Result set 1: total matching posts (for pagination)
    SELECT COUNT(*) AS total
    FROM blogs b
    WHERE (p_include_drafts = 1 OR b.is_published = 1)
      AND (p_search IS NULL
           OR LOCATE(LOWER(p_search), LOWER(b.title)) > 0
           OR LOCATE(LOWER(p_search), LOWER(b.excerpt)) > 0);

    -- Result set 2: the current page (no full content)
    SELECT
        b.blog_id,
        b.title,
        b.slug,
        b.excerpt,
        b.cover_image,
        b.is_published,
        b.published_at,
        b.created_at
    FROM blogs b
    WHERE (p_include_drafts = 1 OR b.is_published = 1)
      AND (p_search IS NULL
           OR LOCATE(LOWER(p_search), LOWER(b.title)) > 0
           OR LOCATE(LOWER(p_search), LOWER(b.excerpt)) > 0)
    -- Drafts have no publish date, so fall back to the creation date
    ORDER BY COALESCE(b.published_at, b.created_at) DESC, b.blog_id DESC
    LIMIT p_limit OFFSET p_offset;
END$$

DELIMITER ;