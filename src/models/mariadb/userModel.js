import { pool } from '../../config/dbConfig';

const createUser = async (userData) => {
  console.log('createUser', userData);
  const { name, email, password } = userData;
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );
    console.log(result);
    return { id: result.insertId, ...userData };
  } catch (error) {
    console.error(error);
    throw new Error('Error creating user');
  } finally {
    if (conn) conn.release();
  }
}

const getAllUsers = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    throw new Error('Error fetching users');
  } finally {
    if (conn) conn.release();
  }
}

export default {
  createUser,
  getAllUsers,
}
