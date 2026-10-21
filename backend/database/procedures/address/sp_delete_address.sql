DROP PROCEDURE IF EXISTS sp_delete_address;

DELIMITER $$

CREATE PROCEDURE sp_delete_address(
    IN p_user_id BIGINT UNSIGNED,
    IN p_address_id BIGINT UNSIGNED
)
BEGIN
    DECLARE v_was_default TINYINT DEFAULT NULL;
    DECLARE v_new_default_id BIGINT UNSIGNED DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Lock the row, and only accept it if it belongs to this user
    SELECT is_default
    INTO v_was_default
    FROM addresses
    WHERE address_id = p_address_id
      AND user_id = p_user_id
    FOR UPDATE;

    IF v_was_default IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ADDRESS_NOT_FOUND';
    END IF;

    DELETE FROM addresses
    WHERE address_id = p_address_id
      AND user_id = p_user_id;

    -- Deleted the default: promote the newest remaining address
    IF v_was_default = 1 THEN
        SELECT address_id
        INTO v_new_default_id
        FROM addresses
        WHERE user_id = p_user_id
        ORDER BY created_at DESC, address_id DESC
        LIMIT 1;

        IF v_new_default_id IS NOT NULL THEN
            UPDATE addresses
            SET is_default = 1
            WHERE address_id = v_new_default_id;
        END IF;
    END IF;

    COMMIT;

    -- NULL if no address is left, or if the deleted one wasn't the default
    SELECT v_new_default_id AS new_default_address_id;
END$$

DELIMITER ;