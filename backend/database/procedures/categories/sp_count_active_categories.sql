DROP PROCEDURE IF EXISTS sp_count_active_categories;

DELIMITER $$

CREATE PROCEDURE sp_count_active_categories(
    IN p_category_ids JSON
)
BEGIN
    SELECT COUNT(*) AS active_count
    FROM categories c
    WHERE c.is_active = 1
      AND c.category_id IN (
          SELECT jt.category_id
          FROM JSON_TABLE(
              p_category_ids,
              '$[*]' COLUMNS (category_id BIGINT UNSIGNED PATH '$')
          ) AS jt
      );
END$$

DELIMITER ;