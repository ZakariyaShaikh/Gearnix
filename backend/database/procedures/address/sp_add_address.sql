DROP PROCEDURE IF EXISTS sp_add_address;

DELIMITER $$

CREATE PROCEDURE sp_add_address(
    IN p_user_id BIGINT UNSIGNED,
    IN p_label VARCHAR(50),
    IN p_full_name VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_line1 VARCHAR(200),
    IN p_line2 VARCHAR(200),
    IN p_city VARCHAR(100),
    IN p_state VARCHAR(100),
    IN p_postal_code VARCHAR(10),
    IN p_country_code CHAR(2),
    IN p_make_default TINYINT
)
BEGIN
    DECLARE v_existing INT DEFAULT 0;
    DECLARE v_is_default TINYINT DEFAULT 0;
    DECLARE v_new_id BIGINT UNSIGNED DEFAULT NULL;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SET v_existing = (
        SELECT COUNT(*)
        FROM addresses
        WHERE user_id = p_user_id
    );

    -- The first address is always the default
    SET v_is_default = IF(v_existing = 0 OR p_make_default = 1, 1, 0);

    -- Clear the old default first, so the unique key is never violated
    IF v_is_default = 1 THEN
        UPDATE addresses
        SET is_default = 0
        WHERE user_id = p_user_id
          AND is_default = 1;
    END IF;

    INSERT INTO addresses
        (user_id, label, full_name, phone, line1, line2, city, state, postal_code, country_code, is_default)
    VALUES
        (p_user_id, p_label, p_full_name, p_phone, p_line1, p_line2, p_city, p_state,
         p_postal_code, COALESCE(p_country_code, 'IN'), v_is_default);

    SET v_new_id = LAST_INSERT_ID();

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
    WHERE address_id = v_new_id;
END$$

DELIMITER ;