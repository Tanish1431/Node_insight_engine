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

import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Serve Frontend ──────────────────────────────────────────
// Serve static files from the React frontend build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Health check (Optional, kept at an api-specific route if needed, but we'll override GET /)
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'NodeGraph Insight Engine API' });
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
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
