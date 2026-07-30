-- 1. Add role column to users
ALTER TABLE users ADD COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user' AFTER email;

-- 2. Update existing accounts based on email (not strictly required as we delete some later, but good practice)
UPDATE users SET role = 'admin' WHERE email LIKE '%@smig.com';

-- 3. Delete specific accounts
DELETE FROM borrow_records WHERE employee_id IN (SELECT id FROM users WHERE email IN ('reza.p@tooltrack.com', 'budi.s@tooltrack.com', 'test@example.com'));
DELETE FROM users WHERE email IN ('reza.p@tooltrack.com', 'budi.s@tooltrack.com', 'test@example.com');

-- 4. Enable event scheduler and create Auto Cleanup event
SET GLOBAL event_scheduler = ON;

DELIMITER //

DROP EVENT IF EXISTS auto_cleanup_borrowing_history //
CREATE EVENT auto_cleanup_borrowing_history
ON SCHEDULE EVERY 1 DAY
DO
BEGIN
  -- Delete borrow_records older than 1 month where status is 'returned'
  DELETE FROM borrow_records 
  WHERE status = 'returned' 
    AND return_time < DATE_SUB(NOW(), INTERVAL 1 MONTH);
END //

DELIMITER ;

-- Update existing positions based on rules
UPDATE users SET position = CASE WHEN email LIKE '%@smig.com' THEN 'Teknisi' WHEN email LIKE '%@gmail.com' OR email LIKE '%@outlook.com' THEN 'Magang' ELSE position END;
