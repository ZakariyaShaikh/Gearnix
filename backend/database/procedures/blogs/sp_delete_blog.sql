DROP PROCEDURE IF EXISTS sp_delete_blog;

DELIMITER $$

CREATE PROCEDURE sp_delete_blog(
    IN p_blog_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_cover_image VARCHAR(500) DEFAULT NULL;
    DECLARE v_deleted TINYINT DEFAULT 0;

    -- Get the cover image path before deleting so the caller can remove the file
    SELECT cover_image INTO v_cover_image FROM blogs WHERE blog_id = p_blog_id;

    DELETE FROM blogs WHERE blog_id = p_blog_id;
    SET v_deleted = ROW_COUNT();

    -- Return the deletion status and cover image path to the service layer
    SELECT v_cover_image AS deleted_cover_image, v_deleted AS deleted;
END$$

DELIMITER ;