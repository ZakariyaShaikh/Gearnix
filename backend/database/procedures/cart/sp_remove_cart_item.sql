DROP PROCEDURE IF EXISTS sp_remove_cart_item;

DELIMITER $$

CREATE PROCEDURE sp_remove_cart_item(
    IN p_user_id BIGINT UNSIGNED,
    IN p_product_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_removed INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    DELETE ci
    FROM cart_items ci
    INNER JOIN carts c ON c.cart_id = ci.cart_id
    WHERE c.user_id = p_user_id
      AND ci.product_id = p_product_id;

    SET v_removed = ROW_COUNT();

    IF v_removed = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'CART_ITEM_NOT_FOUND';
    END IF;

    COMMIT;

    SELECT v_removed AS removed_count;
END$$

DELIMITER ;