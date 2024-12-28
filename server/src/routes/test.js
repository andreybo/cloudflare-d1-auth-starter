import { Hono } from 'hono';

const test = new Hono();

// Debug Environment Variables
test.get('/debug-env', (c) => {
  return c.json({
    AUTH_DB: c.env.AUTH_DB ? 'AUTH_DB connected' : 'AUTH_DB is undefined',
    APP_API_DEV_URL: c.env.APP_API_DEV_URL || 'Not set',
  });
});

// Check Database Connection
test.get('/check-db', async (c) => {
  const db = c.env.AUTH_DB;
  try {
    const result = await db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
      .all();

    return c.json(
      { message: result.results.length > 0 ? 'Users table exists.' : 'Users table does not exist.' },
      result.results.length > 0 ? 200 : 404
    );
  } catch (error) {
    return c.json({ message: 'Internal Server Error.', details: error.message }, 500);
  }
});

export default test;
