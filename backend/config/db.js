import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

// Crear pool apuntando a la base (aunque aún no exista)
const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function createTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id_user INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      pass_hash VARCHAR(255) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lists (
      id_list INT AUTO_INCREMENT PRIMARY KEY,
      id_user INT NOT NULL,
      name_list VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_completed TINYINT(1) DEFAULT 0,
      purchased_at TIMESTAMP NULL DEFAULT NULL,
      FOREIGN KEY (id_user) REFERENCES users(id_user)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS list_items (
      id_item INT AUTO_INCREMENT PRIMARY KEY,
      id_list INT NOT NULL,
      product_name VARCHAR(100) NOT NULL,
      quantity INT DEFAULT 1,
      price DECIMAL(10,2) DEFAULT 0.00,
      is_bought TINYINT(1) DEFAULT 0,
      FOREIGN KEY (id_list) REFERENCES lists(id_list)
    )
  `);
}

export async function initDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      port: DB_PORT || 3306,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Base de datos '${DB_NAME}' lista.`);

    await createTables();
    console.log("✅ Tablas listas.");

    await connection.end();
  } catch (err) {
    console.error("❌ Error inicializando base de datos:", err);
    throw err;
  }
}

export default pool;
