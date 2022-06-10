import SqlString from 'sqlstring';
import client from './../server.js';

async function signUp(name: string = '', email: string = '', cryptPass: string = '', createdAt: string = '') {
  const query = SqlString.format(`INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)`, [
    name,
    email,
    cryptPass,
    createdAt,
  ]);
  return client.query(query);
}

async function signIn(id: number = 0) {
  const query = SqlString.format(`UPDATE users SET active = true WHERE id = ?`, [id]);
  return client.query(query);
}

export { signUp, signIn };
