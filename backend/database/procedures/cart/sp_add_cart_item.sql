DROP PROCEDURE IF EXISTS sp_add_cart_item;

DELIMITER $$

CREATE PROCEDURE sp_add_cart_item(
    IN p_user_id BIGINT UNSIGNED,
    IN p_product_id BIGINT UNSIGNED,
    IN p_quantity INT UNSIGNED
)
BEGIN
    DECLARE v_cart_id BIGINT UNSIGNED DEFAULT NULL;
    DECLARE v_stock INT UNSIGNED DEFAULT 0;
    DECLARE v_is_active TINYINT DEFAULT NULL;
    DECLARE v_current_qty INT UNSIGNED DEFAULT 0;
    DECLARE v_new_qty INT UNSIGNED DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    IF p_quantity = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'QUANTITY_MUST_BE_POSITIVE';
    END IF;

    START TRANSACTION;

    -- One cart per user, created the first time it's needed
    INSERT IGNORE INTO carts (user_id) VALUES (p_user_id);

    SELECT cart_id
    INTO v_cart_id
    FROM carts
    WHERE user_id = p_user_id;

    -- Lock the product so the stock check and the write see the same numbers
    SELECT stock_quantity, is_active
    INTO v_stock, v_is_active
    FROM products
    WHERE product_id = p_product_id
    FOR UPDATE;

    IF v_is_active IS NULL OR v_is_active = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'PRODUCT_UNAVAILABLE';
    END IF;

    -- Adding to an existing line increases it
    SELECT quantity
    INTO v_current_qty
    FROM cart_items
    WHERE cart_id = v_cart_id
      AND product_id = p_product_id;

    SET v_new_qty = v_current_qty + p_quantity;

    IF v_new_qty > v_stock THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'INSUFFICIENT_STOCK';
    END IF;

    INSERT INTO cart_items (cart_id, product_id, quantity)
    VALUES (v_cart_id, p_product_id, v_new_qty)
    ON DUPLICATE KEY UPDATE quantity = v_new_qty;

    COMMIT;

    SELECT product_id, quantity
    FROM cart_items
    WHERE cart_id = v_cart_id
      AND product_id = p_product_id;
END$$

DELIMITER ;