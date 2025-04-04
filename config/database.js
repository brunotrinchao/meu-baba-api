const mysql = require('mysql2/promise');
require('dotenv').config();

let db;

async function initDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'db_meu_baba',
      port: process.env.DB_PORT || 3306
    });

    console.log('✅ Banco de dados conectado!');
  } catch (err) {
    console.error('❌ Erro ao conectar no MySQL:', err);
  }
}

initDB();

module.exports = () => db;
