-- Base de datos
CREATE DATABASE IF NOT EXISTS shoppinglistmvc;

USE shoppinglistmvc;

-- Tabla: users
CREATE TABLE
    users (
        id_user INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        pass_hash VARCHAR(255) NOT NULL
    );

-- Tabla: lists (Corrección aquí)
CREATE TABLE
    lists (
        id_list INT AUTO_INCREMENT PRIMARY KEY,
        id_user INT NOT NULL,
        name_list VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_completed TINYINT (1) DEFAULT 0,
        purchased_at TIMESTAMP NULL DEFAULT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
    );

-- Tabla: list_items (Corrección aquí)
CREATE TABLE
    list_items (
        id_item INT AUTO_INCREMENT PRIMARY KEY,
        id_list INT NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        quantity INT DEFAULT 1,
        price DECIMAL(10, 2) DEFAULT 0.00,
        is_bought TINYINT (1) DEFAULT 0,
        FOREIGN KEY (id_list) REFERENCES lists (id_list) ON DELETE CASCADE
    );

CREATE TABLE
    password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        id_user INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE
    );

CREATE TABLE
    user_settings (
        id_user_setting INT AUTO_INCREMENT PRIMARY KEY,
        id_user INT NOT NULL,
        language VARCHAR(10) NOT NULL,
        currency VARCHAR(5) NOT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user) ON DELETE CASCADE,
        UNIQUE (id_user) -- ¡Esta restricción es clave!
    );