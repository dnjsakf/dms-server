import mariadb from 'mariadb';

import { loadEnv } from '../utils/envUtil';
import { decrypt } from '../utils/cryptoUtil';

loadEnv();

const pool = mariadb.createPool({
  host: process.env.DB_MARIA_HOST,
  port: process.env.DB_MARIA_PORT,
  user: process.env.DB_MARIA_USER,
  password: decrypt(process.env.DB_MARIA_PASSWORD),
  database: process.env.DB_MARIA_DBNAME,
  connectionLimit: 5,
});

const connectDB = async () => {
  console.log('DB Props:', {
    host: process.env.DB_MARIA_HOST,
    port: process.env.DB_MARIA_PORT,
    user: process.env.DB_MARIA_USER,
    password: decrypt(process.env.DB_MARIA_PASSWORD),
    database: process.env.DB_MARIA_DBNAME,
    connectionLimit: 5,
  });

  try {
    await pool.getConnection();
    console.log('MariaDB connected');
  } catch (error) {
    console.error('MariaDB connection error:', error);
    process.exit(1);
  }
};

export {
  pool,
  connectDB,
}
