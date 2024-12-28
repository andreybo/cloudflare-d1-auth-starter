import { Hono } from 'hono';
import {
  getCookie,
  setCookie,
  deleteCookie,
} from 'hono/cookie';
import { generateSalt, hashPassword, verifyPassword, bufferToHex, hexToBuffer } from '../utils/passwords.js';

const auth = new Hono();

// Function to generate a UUID using the Web Crypto API
const randomUUID = () => crypto.randomUUID();

// User registration route
auth.post('/register', async (c) => {
  const { username, email, password, role = 'admin', uuid } = await c.req.json();

  // Validate required fields
  if (!username || !email || !password || !uuid) {
    return c.json({ message: 'All fields are required.' }, 400);
  }

  const db = c.env.AUTH_DB;

  // Check if the user already exists in the database
  const existingUser = await db.prepare('SELECT * FROM users WHERE username = ? OR email = ?')
    .bind(username, email)
    .first();

  if (existingUser) {
    return c.json({ message: 'Username or email already exists.' }, 409);
  }

  // Generate a salt and hash the password
  const salt = generateSalt();
  const hashedPassword = await hashPassword(password, salt);
  const saltHex = bufferToHex(salt);

  // Insert the new user into the database
  await db.prepare('INSERT INTO users (uuid, username, email, password, salt, role) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(uuid, username, email, hashedPassword, saltHex, role)
    .run();

  return c.json({ message: 'User registered successfully.' }, 201);
});

// User login route
auth.post('/login', async (c) => {
  const { usernameOrEmail, password } = await c.req.json();

  // Validate required fields
  if (!usernameOrEmail || !password) {
    return c.json({ message: 'Username or email and password are required.' }, 400);
  }

  const db = c.env.AUTH_DB;

  // Retrieve the user from the database
  const user = await db.prepare('SELECT * FROM users WHERE username = ? OR email = ?')
    .bind(usernameOrEmail, usernameOrEmail)
    .first();

  if (!user) {
    return c.json({ message: 'Invalid credentials.' }, 401);
  }

  // Verify the password using the stored hash and salt
  const salt = hexToBuffer(user.salt);
  const isPasswordValid = await verifyPassword(password, user.password, salt);
  if (!isPasswordValid) {
    return c.json({ message: 'Invalid credentials.' }, 401);
  }

  // Generate a session ID and store session data in the KV store
  const sessionId = randomUUID();
  const sessionData = { username: user.username, role: user.role, uuid: user.uuid };
  await c.env.SESSION_KV.put(sessionId, JSON.stringify(sessionData), { expirationTtl: 3600 });

  // Determine environment and cookie settings
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieDomain = isProduction ? '.toopost.us' : undefined;
  const sameSite = isProduction ? 'None' : 'Lax';
  const secure = isProduction;

  // Set the session cookie
  setCookie(c, 'session_id', sessionId, {
    httpOnly: true,
    secure: secure,
    sameSite: sameSite,
    path: '/',
    domain: cookieDomain,
    maxAge: 3600, // Cookie expiration time in seconds (1 hour)
  });

  console.log('Set-Cookie header sent:', c.res.headers.get('Set-Cookie')); // Debug log

  return c.json({ message: 'Logged in successfully', user: sessionData }, 200);
});

// User logout route
auth.post('/logout', async (c) => {
  const sessionId = getCookie(c, 'session_id');

  if (sessionId) {
    try {
      // Delete the session from the KV store
      await c.env.SESSION_KV.delete(sessionId);

      // Determine environment and cookie settings
      const isProduction = process.env.NODE_ENV === 'production';
      const cookieDomain = isProduction ? '.toopost.us' : undefined;
      const sameSite = isProduction ? 'None' : 'Lax';
      const secure = isProduction;

      // Delete the session cookie
      deleteCookie(c, 'session_id', {
        path: '/',
        secure: secure,
        sameSite: sameSite,
        domain: cookieDomain,
      });

      console.log('Deleted session_id cookie'); // Debug log
      return c.json({ message: 'Logged out successfully.' }, 200);
    } catch (err) {
      console.error('Error during logout:', err.message);
      return c.json({ message: 'Failed to logout.', error: err.message }, 500);
    }
  }

  // If no session is found, return a success response anyway
  return c.json({ message: 'Logged out successfully.' }, 200);
});

// Retrieve session data based on the session cookie
auth.get('/session', async (c) => {
  const sessionId = getCookie(c, 'session_id');

  if (!sessionId) {
    console.log('No session_id cookie found.');
    return c.json({ user: null }, 200);
  }

  try {
    // Retrieve session data from the KV store
    const sessionData = await c.env.SESSION_KV.get(sessionId, { type: 'json' });
    if (!sessionData) {
      console.warn('Session not found for session_id:', sessionId);
      return c.json({ user: null }, 200);
    }
    console.log('Session data found:', sessionData); // Debug log
    return c.json({ user: sessionData }, 200);
  } catch (err) {
    console.error('Error retrieving session:', err.message);
    return c.json({ user: null }, 500);
  }
});

export default auth;
