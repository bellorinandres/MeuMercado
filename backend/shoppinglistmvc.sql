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

-- Tabla: lists
CREATE TABLE
    lists (
        id_list INT AUTO_INCREMENT PRIMARY KEY,
        id_user INT NOT NULL,
        name_list VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_completed TINYINT (1) DEFAULT 0, -- 0 = Pendiente, 1 = Completada
        purchased_at TIMESTAMP NULL DEFAULT NULL,
        FOREIGN KEY (id_user) REFERENCES users (id_user)
    );

-- Me basaré en tu definición original de `list_items`:
CREATE TABLE
    list_items (
        id_item INT AUTO_INCREMENT PRIMARY KEY,
        id_list INT NOT NULL,
        product_name VARCHAR(100) NOT NULL, -- Nombre del producto en esta lista
        quantity INT DEFAULT 1,
        price DECIMAL(10, 2) DEFAULT 0.00, -- Precio del producto cuando se va a comprar/se compró
        is_bought TINYINT (1) DEFAULT 0, -- 0 = No comprada, 1 = Comprada (dentro de esta lista)
        FOREIGN KEY (id_list) REFERENCES lists (id_list)
    );