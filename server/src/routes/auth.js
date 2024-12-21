import { Hono } from 'hono';
import { sign, verify } from '@tsndr/cloudflare-worker-jwt';
import { generateSalt, hashPassword, verifyPassword, hexToBuffer, bufferToHex } from '../utils/password.js';

const auth = new Hono();

// Register Route
auth.post('/register', async (c) => {
  const { username, email, password, role = 'admin' } = await c.req.json();
  if (!username || !email || !password) return c.json({ message: 'All fields are required.' }, 400);

  const db = c.env.AUTH_DB;
  const existingUser = await db
    .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
    .bind(username, email)
    .first();

  if (existingUser) return c.json({ message: 'Username or email already exists.' }, 409);

  const salt = generateSalt();
  const hashedPassword = await hashPassword(password, salt);
  const saltHex = bufferToHex(salt);

  await db
    .prepare('INSERT INTO users (username, email, password, salt, role) VALUES (?, ?, ?, ?, ?)')
    .bind(username, email, hashedPassword, saltHex, role)
    .run();

  return c.json({ message: 'User registered successfully.' }, 201);
});

// Login Route
auth.post('/login', async (c) => {
  const { usernameOrEmail, password } = await c.req.json();
  if (!usernameOrEmail || !password) return c.json({ message: 'Username or email and password are required.' }, 400);

  const db = c.env.AUTH_DB;
  const user = await db
    .prepare('SELECT * FROM users WHERE username = ? OR email = ?')
    .bind(usernameOrEmail, usernameOrEmail)
    .first();

  if (!user) return c.json({ message: 'Invalid credentials.' }, 401);

  const salt = hexToBuffer(user.salt);
  const isPasswordValid = await verifyPassword(password, user.password, salt);

  if (!isPasswordValid) return c.json({ message: 'Invalid credentials.' }, 401);

  const payload = { username: user.username, role: user.role };
  const accessToken = await sign(payload, c.env.JWT_SECRET, { expiresIn: '1h' });

  return c.json({ accessToken, username: user.username, email: user.email, role: user.role }, 200);
});

// Logout Route
auth.post('/logout', async (c) => {
  c.res.cookie('refreshToken', '', { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 0 });
  return c.json({ message: 'Logged out successfully.' }, 200);
});

export default auth;
