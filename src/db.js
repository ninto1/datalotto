// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'datalotto',
    password: 'postgres',
    port: 5432,
});

module.exports = pool;
