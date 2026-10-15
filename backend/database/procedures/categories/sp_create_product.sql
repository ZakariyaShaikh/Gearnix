DROP PROCEDURE IF EXISTS sp_create_product;

DELIMITER $$

CREATE PROCEDURE sp_create_product(
    IN p_name VARCHAR(200),
    IN p_slug VARCHAR(220),
    IN p_description TEXT,
    IN p_price DECIMAL(10,2),
    IN p_stock_quantity INT UNSIGNED,
    IN p_created_by BIGINT UNSIGNED,
    IN p_category_ids JSON
)
BEGIN
    DECLARE v_product_id BIGINT UNSIGNED;

    -- If ANY statement below fails: undo everything, then re-raise the SAME error
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO products (name, slug, description, price, stock_quantity, created_by)
    VALUES (p_name, p_slug, p_description, p_price, p_stock_quantity, p_created_by);

    SET v_product_id = LAST_INSERT_ID();

    INSERT INTO product_categories (product_id, category_id)
    SELECT DISTINCT v_product_id, jt.category_id
    FROM JSON_TABLE(
        p_category_ids,
        '$[*]' COLUMNS (category_id BIGINT UNSIGNED PATH '$')
    ) AS jt;

    COMMIT;

    -- Result set 1: the product
    SELECT
        product_id, name, slug, description, price,
        stock_quantity, is_active, created_by, created_at, updated_at
    FROM products
    WHERE product_id = v_product_id;

    -- Result set 2: its categories
    SELECT c.category_id, c.name, c.slug
    FROM product_categories pc
    JOIN categories c ON c.category_id = pc.category_id
    WHERE pc.product_id = v_product_id
    ORDER BY c.name;
END$$

DELIMITER ;