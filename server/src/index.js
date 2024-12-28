import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth.js';
import test from './routes/test.js';
import main from './routes/main.js';
import rss from './routes/rss.js';
import {
  getCookie
} from 'hono/cookie'

const app = new Hono();

// Global Logging Middleware
app.use('*', async (c, next) => {
  console.log(`Received request: ${c.req.method} ${c.req.url}`);
  console.log('ENV at Global Middleware:', c.env);
  await next();
});

// CORS Middleware
const allowedOrigins = ['https://your-app.com', 'http://localhost:1234'];

app.use(
  '*',
  cors({
    origin: (origin) => (allowedOrigins.includes(origin) ? origin : undefined),
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS', 'DELETE'],
    credentials: true,
  })
);

// Public Routes
const publicRoutes = ['/api/auth/register', '/api/auth/login', '/api/test/check-db', '/api/auth/session', '/api/test-kv-direct'];

// Authentication Middleware
app.use('/api/*', async (c, next) => {
  console.log('SESSION_KV in Middleware:', c.env.SESSION_KV); // Debugging Line

  // Check if SESSION_KV is properly bound
  if (!c.env.SESSION_KV) {
    console.error('SESSION_KV binding is missing.');
    return c.json({ message: 'Internal Server Error: KV Namespace not bound.' }, 500);
  }

  // Check if the route is public
  if (publicRoutes.some(route => c.req.path.startsWith(route))) {
    return next();
  }

  // Manually parse the Cookie header
  const sessionId = getCookie(c, 'session_id')

  console.log('Session ID from Cookie:', sessionId);

  if (!sessionId) {
    console.warn('No session ID found in cookies.');
    return c.json({ message: 'Unauthorized: Missing session ID' }, 401);
  }

  try {
    const userData = await c.env.SESSION_KV.get(sessionId, { type: 'json' });
    console.log('User Data Retrieved from KV:', userData);
    if (!userData) {
      console.warn('Invalid session ID.');
      return c.json({ message: 'Unauthorized: Invalid session ID' }, 401);
    }
    c.set('user', userData);
    await next();
  } catch (err) {
    console.error('Error verifying session:', err.message);
    return c.json({ message: 'Internal Server Error', error: err.message }, 500);
  }
});


// Mount Sub-Routers Correctly
app.route('/api/auth', auth);
app.route('/api/test', test);
app.route('/api/main', main);
app.route('/api/rss', rss);

// Minimal Test Route for KV
app.get('/api/test-kv-direct', async (c) => {
  try {
    const kvNamespace = c.env.SESSION_KV;
    if (!kvNamespace) {
      console.error('SESSION_KV is undefined or invalid.');
      return c.json({ error: 'SESSION_KV is undefined or invalid' }, 500);
    }

    // Attempt to get a test key
    const value = await kvNamespace.get('test_key');
    return c.json({ value });
  } catch (err) {
    console.error('Error accessing SESSION_KV:', err);
    return c.json({ error: 'Failed to access SESSION_KV', details: err.message }, 500);
  }
});

// Export the fetch handler with additional logging
export default {
  async fetch(request, env, ctx) {
    console.log('Fetch handler invoked');
    console.log('ENV in fetch:', env);
    return app.fetch(request, env, ctx);
  }
};
