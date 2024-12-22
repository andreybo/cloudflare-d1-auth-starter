import { Hono } from 'hono';
import { cors } from 'hono/cors';
import auth from './routes/auth.js';
import test from './routes/test.js';
import main from './routes/main.js';
import { jwt } from 'hono/jwt';

const app = new Hono();

const allowedOrigins = ['https://your-app.live.com', 'http://localhost:1234'];

app.use('*', cors({
  origin: (origin) => {
    if (origin && allowedOrigins.includes(origin)) {
      return origin;
    }
    return undefined;
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  credentials: true,
}));

const publicRoutes = ['/api/register', '/api/login', '/api/check-db'];

// JWT Authentication Middleware
app.use('/api/*', async (c, next) => {
  // Skip JWT authentication for public routes
  if (publicRoutes.includes(c.req.path)) {
    return next();
  }

  // Apply JWT middleware
  try {
    const token = c.req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const payload = await jwt({ secret: c.env.JWT_SECRET }).verify(token);
    if (!payload) {
      return c.json({ message: 'Invalid token' }, 401);
    }

    // Add user information to context
    c.set('user', payload);
    return next();
  } catch (err) {
    return c.json({ message: 'Unauthorized', error: err.message }, 401);
  }
});

// Mount Routes
app.route('/api', auth);
app.route('/api', test);
app.route('/api', main);

export default app;
