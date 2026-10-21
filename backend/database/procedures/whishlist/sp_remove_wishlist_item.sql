DROP PROCEDURE IF EXISTS sp_remove_wishlist_item;

DELIMITER $$

CREATE PROCEDURE sp_remove_wishlist_item(
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

    DELETE wi
    FROM wishlist_items wi
    INNER JOIN wishlists w ON w.wishlist_id = wi.wishlist_id
    WHERE w.user_id = p_user_id
      AND wi.product_id = p_product_id;

    SET v_removed = ROW_COUNT();

    IF v_removed = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'WISHLIST_ITEM_NOT_FOUND';
    END IF;

    COMMIT;

    SELECT v_removed AS removed_count;
END$$

DELIMITER ;