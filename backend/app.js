import express from 'express';
import cors from 'cors';
import { bfhlRouter } from './routes/bfhlRoutes.js';

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Structured request logger
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────
app.use('/bfhl', bfhlRouter);

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'NodeGraph Insight Engine' });
});

// ─── Centralized Error Handler ───────────────────────────────
app.use((err, _req, res, _next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${err.message}`);
  console.error(err.stack);

  res.status(err.status || 500).json({
    is_success: false,
    error: err.message || 'Internal server error',
  });
});

export default app;
