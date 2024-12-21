import { Hono } from 'hono';

const main = new Hono();

// Protected Route
main.get('/protected', (c) => {
  const user = c.get('user');
  return c.json({ message: `Hello, ${user.username}! You accessed a protected route.` });
});

// Admin Route
main.get('/admin', (c) => {
  const user = c.get('user');
  if (!user.roles.includes('admin')) {
    return c.json({ message: 'Forbidden' }, 403);
  }
  return c.json({ message: `Welcome, admin ${user.username}!` });
});

export default main;
