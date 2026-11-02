DROP PROCEDURE IF EXISTS sp_list_all_orders;

DELIMITER $$

CREATE PROCEDURE sp_list_all_orders(
    IN p_status VARCHAR(20),
    IN p_search VARCHAR(100),
    IN p_limit INT UNSIGNED,
    IN p_offset INT UNSIGNED
)
BEGIN
    -- Result set 1: total count of orders matching the filters (for pagination)
    -- Status and search are optional: empty/NULL means no filter on that axis
    SELECT COUNT(*) AS total
    FROM orders o
    JOIN users u ON u.user_id = o.user_id
    WHERE (p_status IS NULL OR TRIM(p_status) = '' OR o.status = p_status)
      AND (p_search IS NULL OR TRIM(p_search) = '' OR u.username LIKE CONCAT('%', TRIM(p_search), '%') OR u.email LIKE CONCAT('%', TRIM(p_search), '%') OR o.order_number LIKE CONCAT('%', TRIM(p_search), '%'));

    -- Result set 2: the page of orders, newest first, with customer username and email
    SELECT
        o.order_id,
        o.order_number,
        o.status,
        o.total,
        o.currency,
        o.created_at,
        o.paid_at,
        o.user_id,
        u.username,
        u.email,
        (SELECT COALESCE(SUM(oi.quantity), 0) FROM order_items oi WHERE oi.order_id = o.order_id) AS item_count
    FROM orders o
    JOIN users u ON u.user_id = o.user_id
    WHERE (p_status IS NULL OR TRIM(p_status) = '' OR o.status = p_status)
      AND (p_search IS NULL OR TRIM(p_search) = '' OR u.username LIKE CONCAT('%', TRIM(p_search), '%') OR u.email LIKE CONCAT('%', TRIM(p_search), '%') OR o.order_number LIKE CONCAT('%', TRIM(p_search), '%'))
    ORDER BY o.created_at DESC, o.order_id DESC
    LIMIT p_limit OFFSET p_offset;
END$$

DELIMITER ;
