const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_NAME || 'db_meu_baba',
    port: process.env.DB_PORT || '3306'
});

db.connect(err => {
    if (err) {
        console.error('❌ Erro ao conectar no MySQL:', err);
        return;
    }
    console.log('✅ Banco de dados conectado!');
});

module.exports = db;
