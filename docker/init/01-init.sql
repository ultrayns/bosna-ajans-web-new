-- Initialize database with proper charset
ALTER DATABASE bosnaajans CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Grant permissions
GRANT ALL PRIVILEGES ON bosnaajans.* TO 'bosnaajans'@'%';
FLUSH PRIVILEGES;
