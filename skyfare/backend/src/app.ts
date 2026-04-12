import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { flightRoutes } from './routes/flight.routes.js';
import { healthRoutes } from './routes/health.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());
  app.use('/api', healthRoutes);
  app.use('/api', flightRoutes);

  return app;
}
