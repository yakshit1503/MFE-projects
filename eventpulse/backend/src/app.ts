import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { healthRoutes } from './routes/health.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());
  app.use('/api', healthRoutes);

  return app;
}
