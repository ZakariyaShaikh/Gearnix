DROP PROCEDURE IF EXISTS sp_list_orders;

DELIMITER $$

CREATE PROCEDURE sp_list_orders(
    IN p_user_id BIGINT UNSIGNED,
    IN p_limit INT UNSIGNED,
    IN p_offset INT UNSIGNED
)
BEGIN
    -- Result set 1: how many orders this customer has (for pagination)
    SELECT COUNT(*) AS total
    FROM orders
    WHERE user_id = p_user_id;

    -- Result set 2: the current page, newest first
    SELECT
        o.order_id,
        o.order_number,
        o.status,
        o.total,
        o.currency,
        o.created_at,
        o.paid_at,
        (
            SELECT COALESCE(SUM(oi.quantity), 0)
            FROM order_items oi
            WHERE oi.order_id = o.order_id
        ) AS item_count
    FROM orders o
    WHERE o.user_id = p_user_id
    ORDER BY o.created_at DESC, o.order_id DESC
    LIMIT p_limit OFFSET p_offset;
END$$

DELIMITER ;