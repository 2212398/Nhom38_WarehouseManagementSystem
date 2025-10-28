-- ============================================
-- Seed Data: Master Data (Products, Warehouses, etc.)
-- ============================================

-- Insert Units of Measure
INSERT INTO uom (id, code, name, uom_type) VALUES
(gen_random_uuid(), 'PCS', 'Pieces', 'QUANTITY'),
(gen_random_uuid(), 'BOX', 'Box', 'QUANTITY'),
(gen_random_uuid(), 'CTN', 'Carton', 'QUANTITY'),
(gen_random_uuid(), 'PLT', 'Pallet', 'QUANTITY'),
(gen_random_uuid(), 'KG', 'Kilogram', 'WEIGHT'),
(gen_random_uuid(), 'G', 'Gram', 'WEIGHT'),
(gen_random_uuid(), 'L', 'Liter', 'VOLUME'),
(gen_random_uuid(), 'ML', 'Milliliter', 'VOLUME')
ON CONFLICT (code) DO NOTHING;

-- Insert Product Categories
INSERT INTO product_categories (id, code, name, description, level, path) VALUES
(gen_random_uuid(), 'ELEC', 'Electronics', 'Electronic devices and components', 1, '/ELEC'),
(gen_random_uuid(), 'FOOD', 'Food & Beverage', 'Food and drink products', 1, '/FOOD'),
(gen_random_uuid(), 'CLOTH', 'Clothing', 'Apparel and accessories', 1, '/CLOTH'),
(gen_random_uuid(), 'PHARMA', 'Pharmaceuticals', 'Medical and pharmaceutical products', 1, '/PHARMA'),
(gen_random_uuid(), 'HOME', 'Home & Garden', 'Home improvement and garden products', 1, '/HOME')
ON CONFLICT (code) DO NOTHING;

-- Insert Warehouses
INSERT INTO warehouses (id, code, name, type, address_line1, city, country, phone, email, total_capacity, capacity_uom, is_active) VALUES
(gen_random_uuid(), 'WH001', 'Main Warehouse - HCM', 'DISTRIBUTION', '123 Industrial Street', 'Ho Chi Minh', 'VN', '+84123456789', 'wh001@email.com', 10000, 'm3', true),
(gen_random_uuid(), 'WH002', 'Secondary Warehouse - HN', 'DISTRIBUTION', '456 Storage Road', 'Hanoi', 'VN', '+84987654321', 'wh002@email.com', 5000, 'm3', true),
(gen_random_uuid(), 'WH003', 'Cold Storage - HCM', 'COLD_STORAGE', '789 Freezer Lane', 'Ho Chi Minh', 'VN', '+84111222333', 'wh003@email.com', 2000, 'm3', true)
ON CONFLICT (code) DO NOTHING;

-- Insert sample products
DO $$
DECLARE
    v_cat_id uuid;
    v_uom_id uuid;
    v_user_id uuid;
BEGIN
    -- Get category and UOM IDs
    SELECT id INTO v_cat_id FROM product_categories WHERE code = 'ELEC' LIMIT 1;
    SELECT id INTO v_uom_id FROM uom WHERE code = 'PCS' LIMIT 1;
    SELECT id INTO v_user_id FROM users WHERE email = 'admin@email.com' LIMIT 1;

    -- Insert sample products
    INSERT INTO products (id, sku, name, description, category_id, base_uom_id, weight, weight_uom, 
                         length, width, height, dimension_uom, stock_strategy, abc_class, 
                         unit_cost, unit_price, is_active, created_by) VALUES
    (gen_random_uuid(), 'PROD001', 'Laptop Dell XPS 13', 'High-performance ultrabook', v_cat_id, v_uom_id, 
     1.2, 'KG', 30, 20, 2, 'CM', 'FIFO', 'A', 800.00, 1200.00, true, v_user_id),
    (gen_random_uuid(), 'PROD002', 'Wireless Mouse Logitech', 'Ergonomic wireless mouse', v_cat_id, v_uom_id, 
     0.1, 'KG', 12, 8, 5, 'CM', 'FIFO', 'B', 15.00, 25.00, true, v_user_id),
    (gen_random_uuid(), 'PROD003', 'USB Cable 2m', 'USB-C to USB-A cable', v_cat_id, v_uom_id, 
     0.05, 'KG', 200, 1, 1, 'CM', 'FIFO', 'C', 3.00, 8.00, true, v_user_id)
    ON CONFLICT (sku) DO NOTHING;
    
    RAISE NOTICE 'Sample products created successfully!';
END $$;

-- Log seeding completion
DO $$
BEGIN
    RAISE NOTICE 'Master Data seeded successfully!';
    RAISE NOTICE '  - 8 Units of Measure';
    RAISE NOTICE '  - 5 Product Categories';
    RAISE NOTICE '  - 3 Warehouses';
    RAISE NOTICE '  - 3 Sample Products';
END $$;
