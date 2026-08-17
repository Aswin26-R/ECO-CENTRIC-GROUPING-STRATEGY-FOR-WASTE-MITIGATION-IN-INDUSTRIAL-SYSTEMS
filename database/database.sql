-- Steel Waste Management System
-- MySQL schema
-- Run: mysql -u root -p < database.sql

CREATE DATABASE IF NOT EXISTS steel_waste_management
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE steel_waste_management;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    production_process VARCHAR(120) NOT NULL,
    raw_material VARCHAR(120) NOT NULL,
    process_stage VARCHAR(120) NOT NULL,
    material_category VARCHAR(120) NOT NULL,
    production_quantity FLOAT NOT NULL,
    material_quantity FLOAT NOT NULL,

    predicted_waste_type VARCHAR(120) NOT NULL,
    waste_category VARCHAR(80) NOT NULL,
    action VARCHAR(40) NOT NULL DEFAULT 'Review',
    confidence FLOAT NOT NULL,
    priority VARCHAR(40) NOT NULL,
    recommendation VARCHAR(255) NOT NULL,
    environmental_note VARCHAR(255),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_predictions_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_predictions_created_at ON predictions (created_at);
CREATE INDEX idx_predictions_waste_category ON predictions (waste_category);

-- Note: the application (app.py) also auto-creates these tables via
-- SQLAlchemy's db.create_all() on first run, and seeds a demo login
-- account (demo@steelwaste.io / demo1234). This file is provided so the
-- schema can also be created directly / reviewed independently, as
-- required by the project brief.
