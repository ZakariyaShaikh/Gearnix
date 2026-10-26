DROP PROCEDURE IF EXISTS sp_get_order_detail;

DELIMITER $$

CREATE PROCEDURE sp_get_order_detail(
    IN p_user_id BIGINT UNSIGNED,
    IN p_order_id BIGINT UNSIGNED
)
BEGIN
    -- Result set 1: the order, with the address it was shipped to.
    -- Empty if the order doesn't exist or belongs to someone else
    SELECT
        order_id,
        order_number,
        status,
        subtotal,
        total,
        currency,
        ship_full_name,
        ship_phone,
        ship_line1,
        ship_line2,
        ship_city,
        ship_state,
        ship_postal_code,
        ship_country_code,
        paid_at,
        created_at,
        updated_at
    FROM orders
    WHERE order_id = p_order_id
      AND user_id = p_user_id
    LIMIT 1;

    -- Result set 2: the items, with the name and price saved at checkout
    SELECT
        oi.product_id,
        oi.product_name,
        oi.unit_price,
        oi.quantity,
        oi.line_total
    FROM order_items oi
    INNER JOIN orders o ON o.order_id = oi.order_id
    WHERE oi.order_id = p_order_id
      AND o.user_id = p_user_id
    ORDER BY oi.order_item_id;

    -- Result set 3: the latest payment attempt for this order
    SELECT
        p.provider_order_id,
        p.provider_payment_id,
        p.amount_paise,
        p.status
    FROM payments p
    INNER JOIN orders o ON o.order_id = p.order_id
    WHERE p.order_id = p_order_id
      AND o.user_id = p_user_id
    ORDER BY p.payment_id DESC
    LIMIT 1;
END$$

DELIMITER ;