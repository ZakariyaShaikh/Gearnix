DROP PROCEDURE IF EXISTS sp_list_addresses;

DELIMITER $$

CREATE PROCEDURE sp_list_addresses(
    IN p_user_id BIGINT UNSIGNED
)
BEGIN
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
    WHERE user_id = p_user_id
    ORDER BY is_default DESC, created_at DESC, address_id DESC;
END$$

DELIMITER ;