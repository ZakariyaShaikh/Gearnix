DROP PROCEDURE IF EXISTS sp_update_address;

DELIMITER $$

CREATE PROCEDURE sp_update_address(
    IN p_user_id BIGINT UNSIGNED,
    IN p_address_id BIGINT UNSIGNED,
    IN p_label VARCHAR(50),
    IN p_update_label TINYINT,
    IN p_full_name VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_line1 VARCHAR(200),
    IN p_line2 VARCHAR(200),
    IN p_update_line2 TINYINT,
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(100),
    IN p_postal_code VARCHAR(10),
    IN p_country_code CHAR(2),
    IN p_make_default TINYINT
)
BEGIN
    DECLARE v_owned INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Ownership check: the address must belong to this user
    SET v_owned = (
        SELECT COUNT(*)
        FROM addresses
        WHERE address_id = p_address_id
          AND user_id = p_user_id
    );

    IF v_owned = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'ADDRESS_NOT_FOUND';
    END IF;

    -- Making this address the default: clear the old default first
    IF p_make_default = 1 THEN
        UPDATE addresses
        SET is_default = 0
        WHERE user_id = p_user_id
          AND is_default = 1
          AND address_id <> p_address_id;
    END IF;

    -- NULL means "keep"; the update_* flags let label and line2 be cleared
    UPDATE addresses
    SET label = IF(p_update_label = 1, p_label, label),
        full_name = COALESCE(p_full_name, full_name),
        phone = COALESCE(p_phone, phone),
        line1 = COALESCE(p_line1, line1),
        line2 = IF(p_update_line2 = 1, p_line2, line2),
        city = COALESCE(p_city, city),
        state = COALESCE(p_state, state),
        postal_code = COALESCE(p_postal_code, postal_code),
        country_code = COALESCE(p_country_code, country_code),
        is_default = IF(p_make_default = 1, 1, is_default),
        updated_at = NOW()
    WHERE address_id = p_address_id
      AND user_id = p_user_id;

    COMMIT;

    SELECT
        address_id,
        label,
        full_name,
        phone,
        line1,
        line2,
        city,
        state,
        postal_code,
        country_code,
        is_default,
        created_at,
        updated_at
    FROM addresses
    WHERE address_id = p_address_id
      AND user_id = p_user_id;
END$$

DELIMITER ;