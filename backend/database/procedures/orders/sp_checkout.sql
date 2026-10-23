DROP PROCEDURE IF EXISTS sp_checkout;

DELIMITER $$

CREATE PROCEDURE sp_checkout(
    IN p_user_id BIGINT UNSIGNED,
    IN p_address_id BIGINT UNSIGNED,
    IN p_order_number VARCHAR(30)
)
BEGIN
    DECLARE v_cart_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_line_count INT DEFAULT 0;
    DECLARE v_unavailable INT DEFAULT 0;
    DECLARE v_short INT DEFAULT 0;
    DECLARE v_subtotal DECIMAL(10,2) DEFAULT 0;
    DECLARE v_order_id BIGINT UNSIGNED DEFAULT NULL;

    -- Address snapshot variables
    DECLARE v_full_name VARCHAR(100);
    DECLARE v_phone VARCHAR(15);
    DECLARE v_line1 VARCHAR(200);
    DECLARE v_line2 VARCHAR(200);
    DECLARE v_city VARCHAR(100);
    DECLARE v_state VARCHAR(100);
    DECLARE v_postal_code VARCHAR(10);
    DECLARE v_country_code CHAR(2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        DROP TEMPORARY TABLE IF EXISTS tmp_checkout_lines;
        RESIGNAL;
    END;

    -- A temporary table holds the locked cart lines for this checkout only
    DROP TEMPORARY TABLE IF EXISTS tmp_checkout_lines;

    CREATE TEMPORARY TABLE tmp_checkout_lines (
        product_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
        product_name VARCHAR(200) NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        quantity INT UNSIGNED NOT NULL,
        stock_quantity INT UNSIGNED NOT NULL,
        is_active TINYINT NOT NULL
    );

    START TRANSACTION;

    -- 1. The address must belong to this user; its details are copied onto the order
    SELECT full_name, phone, line1, line2, city, state, postal_code, country_code
    INTO v_full_name, v_phone, v_line1, v_line2, v_city, v_state, v_postal_code, v_country_code
    FROM addresses
    WHERE address_id = p_address_id
      AND user_id = p_user_id;

    IF v_full_name IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ADDRESS_NOT_FOUND';
    END IF;

    -- 2. The cart must exist
    SELECT cart_id
    INTO v_cart_id
    FROM carts
    WHERE user_id = p_user_id;

    IF v_cart_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CART_EMPTY';
    END IF;

    -- 3. Copy the cart lines, locking the products in ID order
    INSERT INTO tmp_checkout_lines
        (product_id, product_name, unit_price, quantity, stock_quantity, is_active)
    SELECT p.product_id, p.name, p.price, ci.quantity, p.stock_quantity, p.is_active
    FROM cart_items ci
    INNER JOIN products p ON p.product_id = ci.product_id
    WHERE ci.cart_id = v_cart_id
    ORDER BY p.product_id
    FOR UPDATE;

    SELECT COUNT(*) INTO v_line_count FROM tmp_checkout_lines;

    IF v_line_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CART_EMPTY';
    END IF;

    -- 4. Every line must still be buyable right now
    SELECT COUNT(*) INTO v_unavailable
    FROM tmp_checkout_lines
    WHERE is_active = 0;

    IF v_unavailable > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PRODUCT_UNAVAILABLE';
    END IF;

    SELECT COUNT(*) INTO v_short
    FROM tmp_checkout_lines
    WHERE quantity > stock_quantity;

    IF v_short > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'INSUFFICIENT_STOCK';
    END IF;

    -- 5. Totals from the locked, live prices
    SELECT COALESCE(SUM(unit_price * quantity), 0)
    INTO v_subtotal
    FROM tmp_checkout_lines;

    -- 6. The order, with the address snapshot
    INSERT INTO orders
        (order_number, user_id, status, subtotal, total,
         ship_full_name, ship_phone, ship_line1, ship_line2,
         ship_city, ship_state, ship_postal_code, ship_country_code)
    VALUES
        (p_order_number, p_user_id, 'pending_payment', v_subtotal, v_subtotal,
         v_full_name, v_phone, v_line1, v_line2,
         v_city, v_state, v_postal_code, v_country_code);

    SET v_order_id = LAST_INSERT_ID();

    -- 7. The order items, with the name and price as they are right now
    INSERT INTO order_items
        (order_id, product_id, product_name, unit_price, quantity, line_total)
    SELECT v_order_id, product_id, product_name, unit_price, quantity, unit_price * quantity
    FROM tmp_checkout_lines;

    -- 8. Reserve the stock (safe: the products are locked and were checked above)
    UPDATE products p
    INNER JOIN tmp_checkout_lines l ON l.product_id = p.product_id
    SET p.stock_quantity = p.stock_quantity - l.quantity;

    -- 9. Empty the cart. The cart row itself stays
    DELETE FROM cart_items
    WHERE cart_id = v_cart_id;

    COMMIT;

    DROP TEMPORARY TABLE IF EXISTS tmp_checkout_lines;

    -- Result set 1: the order
    SELECT
        order_id,
        order_number,
        status,
        subtotal,
        total,
        currency,
        created_at
    FROM orders
    WHERE order_id = v_order_id;

    -- Result set 2: its items
    SELECT
        product_id,
        product_name,
        unit_price,
        quantity,
        line_total
    FROM order_items
    WHERE order_id = v_order_id
    ORDER BY order_item_id;
END$$

DELIMITER ;