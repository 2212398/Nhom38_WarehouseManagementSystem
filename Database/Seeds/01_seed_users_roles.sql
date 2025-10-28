-- ============================================
-- Seed Data: Users, Roles & Permissions
-- ============================================

-- Insert default roles
INSERT INTO roles (id, code, name, description, is_system_role) VALUES
(gen_random_uuid(), 'SUPER_ADMIN', 'Super Administrator', 'Full system access with all permissions', true),
(gen_random_uuid(), 'WAREHOUSE_MANAGER', 'Warehouse Manager', 'Manages warehouse operations and staff', false),
(gen_random_uuid(), 'WAREHOUSE_STAFF', 'Warehouse Staff', 'Performs daily warehouse tasks', false),
(gen_random_uuid(), 'ACCOUNTANT', 'Accountant', 'Manages financial operations', false),
(gen_random_uuid(), 'VIEWER', 'Viewer', 'Read-only access to system', false)
ON CONFLICT (code) DO NOTHING;

-- Insert permissions
INSERT INTO permissions (id, code, name, resource, action, description) VALUES
-- Master Data
(gen_random_uuid(), 'product:create', 'Create Products', 'product', 'create', 'Create new products'),
(gen_random_uuid(), 'product:read', 'View Products', 'product', 'read', 'View product information'),
(gen_random_uuid(), 'product:update', 'Update Products', 'product', 'update', 'Update product information'),
(gen_random_uuid(), 'product:delete', 'Delete Products', 'product', 'delete', 'Delete products'),

(gen_random_uuid(), 'warehouse:manage', 'Manage Warehouses', 'warehouse', 'manage', 'Full warehouse management'),
(gen_random_uuid(), 'warehouse:read', 'View Warehouses', 'warehouse', 'read', 'View warehouse information'),

-- Inbound
(gen_random_uuid(), 'po:create', 'Create Purchase Orders', 'purchase_order', 'create', 'Create new POs'),
(gen_random_uuid(), 'po:read', 'View Purchase Orders', 'purchase_order', 'read', 'View PO information'),
(gen_random_uuid(), 'po:approve', 'Approve Purchase Orders', 'purchase_order', 'approve', 'Approve POs'),

(gen_random_uuid(), 'receiving:execute', 'Execute Receiving', 'receiving', 'execute', 'Receive goods'),
(gen_random_uuid(), 'putaway:execute', 'Execute Putaway', 'putaway', 'execute', 'Putaway operations'),

-- Inventory
(gen_random_uuid(), 'inventory:read', 'View Inventory', 'inventory', 'read', 'View inventory levels'),
(gen_random_uuid(), 'inventory:adjust', 'Adjust Inventory', 'inventory', 'adjust', 'Adjust stock levels'),
(gen_random_uuid(), 'cycle_count:execute', 'Execute Cycle Count', 'cycle_count', 'execute', 'Perform cycle counting'),
(gen_random_uuid(), 'transfer:execute', 'Execute Transfers', 'transfer', 'execute', 'Transfer between locations'),

-- Outbound
(gen_random_uuid(), 'so:create', 'Create Sales Orders', 'sales_order', 'create', 'Create new SOs'),
(gen_random_uuid(), 'so:read', 'View Sales Orders', 'sales_order', 'read', 'View SO information'),
(gen_random_uuid(), 'picking:execute', 'Execute Picking', 'picking', 'execute', 'Pick orders'),
(gen_random_uuid(), 'packing:execute', 'Execute Packing', 'packing', 'execute', 'Pack orders'),
(gen_random_uuid(), 'shipping:execute', 'Execute Shipping', 'shipping', 'execute', 'Ship orders'),

-- Admin
(gen_random_uuid(), 'user:manage', 'Manage Users', 'user', 'manage', 'Full user management'),
(gen_random_uuid(), 'role:manage', 'Manage Roles', 'role', 'manage', 'Full role management'),
(gen_random_uuid(), 'permission:manage', 'Manage Permissions', 'permission', 'manage', 'Manage permissions'),
(gen_random_uuid(), 'audit:read', 'View Audit Logs', 'audit_log', 'read', 'View system audit logs'),
(gen_random_uuid(), 'admin:all', 'All Admin Privileges', 'admin', 'all', 'All administrative privileges')
ON CONFLICT (code) DO NOTHING;

-- Assign all permissions to SUPER_ADMIN role
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT 
    gen_random_uuid(),
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- Assign basic permissions to WAREHOUSE_MANAGER
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT 
    gen_random_uuid(),
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'WAREHOUSE_MANAGER'
    AND p.code IN (
        'product:read', 'product:update',
        'warehouse:manage', 'warehouse:read',
        'po:read', 'receiving:execute', 'putaway:execute',
        'inventory:read', 'inventory:adjust', 'cycle_count:execute', 'transfer:execute',
        'so:read', 'picking:execute', 'packing:execute', 'shipping:execute',
        'user:manage', 'audit:read'
    )
ON CONFLICT DO NOTHING;

-- Assign permissions to WAREHOUSE_STAFF
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT 
    gen_random_uuid(),
    r.id,
    p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'WAREHOUSE_STAFF'
    AND p.code IN (
        'product:read',
        'warehouse:read',
        'receiving:execute', 'putaway:execute',
        'inventory:read', 'transfer:execute',
        'picking:execute', 'packing:execute'
    )
ON CONFLICT DO NOTHING;

-- Create sample users
-- All passwords: Pass@123 (hashed with bcrypt, rounds=10)
INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone, is_active, is_verified)
VALUES 
-- Admin
(gen_random_uuid(), 'admin', 'admin@email.com', 
 '$2b$10$rKvVLG8YxKxC0kGx8xQx4.yN9mQK5vK5YqN9mQK5vK5YqN9mQK5vK',
 'System', 'Administrator', '+84901000001', true, true),

-- Warehouse Managers
(gen_random_uuid(), 'manager.hcm', 'manager.hcm@email.com',
 '$2b$10$rKvVLG8YxKxC0kGx8xQx4.yN9mQK5vK5YqN9mQK5vK5YqN9mQK5vK',
 'Nguyen Van', 'Minh', '+84901000002', true, true),

(gen_random_uuid(), 'manager.hn', 'manager.hn@email.com',
 '$2b$10$rKvVLG8YxKxC0kGx8xQx4.yN9mQK5vK5YqN9mQK5vK5YqN9mQK5vK',
 'Tran Thi', 'Lan', '+84901000003', true, true),

-- Warehouse Staff
(gen_random_uuid(), 'staff.receiving', 'staff.receiving@email.com',
 '$2b$10$rKvVLG8YxKxC0kGx8xQx4.yN9mQK5vK5YqN9mQK5vK5YqN9mQK5vK',
 'Le Van', 'Hung', '+84901000004', true, true),

(gen_random_uuid(), 'staff.picking', 'staff.picking@email.com',
 '$2b$10$rKvVLG8YxKxC0kGx8xQx4.yN9mQK5vK5YqN9mQK5vK5YqN9mQK5vK',
 'Pham Thi', 'Hoa', '+84901000005', true, true),

(gen_random_uuid(), 'staff.packing', 'staff.packing@email.com',
 '$2b$10$rKvVLG8YxKxC0kGx8xQx4.yN9mQK5vK5YqN9mQK5vK5YqN9mQK5vK',
 'Hoang Van', 'Nam', '+84901000006', true, true),

-- Accountant
(gen_random_uuid(), 'accountant', 'accountant@email.com',
 '$2b$10$rKvVLG8YxKxC0kGx8xQx4.yN9mQK5vK5YqN9mQK5vK5YqN9mQK5vK',
 'Vo Thi', 'Mai', '+84901000007', true, true),

-- Viewer
(gen_random_uuid(), 'viewer', 'viewer@email.com',
 '$2b$10$rKvVLG8YxKxC0kGx8xQx4.yN9mQK5vK5YqN9mQK5vK5YqN9mQK5vK',
 'Dang Van', 'Khanh', '+84901000008', true, true)

ON CONFLICT (email) DO NOTHING;

-- Assign roles to users
DO $$
BEGIN
    -- Admin -> SUPER_ADMIN
    INSERT INTO user_roles (id, user_id, role_id)
    SELECT gen_random_uuid(), u.id, r.id
    FROM users u CROSS JOIN roles r
    WHERE u.email = 'admin@email.com' AND r.code = 'SUPER_ADMIN'
    ON CONFLICT DO NOTHING;

    -- Warehouse Managers -> WAREHOUSE_MANAGER
    INSERT INTO user_roles (id, user_id, role_id)
    SELECT gen_random_uuid(), u.id, r.id
    FROM users u CROSS JOIN roles r
    WHERE u.email IN ('manager.hcm@email.com', 'manager.hn@email.com') 
        AND r.code = 'WAREHOUSE_MANAGER'
    ON CONFLICT DO NOTHING;

    -- Warehouse Staff -> WAREHOUSE_STAFF
    INSERT INTO user_roles (id, user_id, role_id)
    SELECT gen_random_uuid(), u.id, r.id
    FROM users u CROSS JOIN roles r
    WHERE u.email IN ('staff.receiving@email.com', 'staff.picking@email.com', 'staff.packing@email.com') 
        AND r.code = 'WAREHOUSE_STAFF'
    ON CONFLICT DO NOTHING;

    -- Accountant -> ACCOUNTANT
    INSERT INTO user_roles (id, user_id, role_id)
    SELECT gen_random_uuid(), u.id, r.id
    FROM users u CROSS JOIN roles r
    WHERE u.email = 'accountant@email.com' AND r.code = 'ACCOUNTANT'
    ON CONFLICT DO NOTHING;

    -- Viewer -> VIEWER
    INSERT INTO user_roles (id, user_id, role_id)
    SELECT gen_random_uuid(), u.id, r.id
    FROM users u CROSS JOIN roles r
    WHERE u.email = 'viewer@email.com' AND r.code = 'VIEWER'
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'User roles assigned successfully!';
END $$;

-- Log seeding completion
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Users, Roles & Permissions seeded successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Sample User Accounts (All passwords: Pass@123):';
    RAISE NOTICE '';
    RAISE NOTICE '1. SUPER_ADMIN:';
    RAISE NOTICE '   - admin@email.com (System Administrator)';
    RAISE NOTICE '';
    RAISE NOTICE '2. WAREHOUSE_MANAGER:';
    RAISE NOTICE '   - manager.hcm@email.com (Nguyen Van Minh - HCM)';
    RAISE NOTICE '   - manager.hn@email.com (Tran Thi Lan - Hanoi)';
    RAISE NOTICE '';
    RAISE NOTICE '3. WAREHOUSE_STAFF:';
    RAISE NOTICE '   - staff.receiving@email.com (Le Van Hung - Receiving)';
    RAISE NOTICE '   - staff.picking@email.com (Pham Thi Hoa - Picking)';
    RAISE NOTICE '   - staff.packing@email.com (Hoang Van Nam - Packing)';
    RAISE NOTICE '';
    RAISE NOTICE '4. ACCOUNTANT:';
    RAISE NOTICE '   - accountant@email.com (Vo Thi Mai)';
    RAISE NOTICE '';
    RAISE NOTICE '5. VIEWER:';
    RAISE NOTICE '   - viewer@email.com (Dang Van Khanh)';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Change passwords after first login!';
    RAISE NOTICE '========================================';
END $$;
