import { createApp } from './app.js';
import { connectToDatabase } from './config/database.js';
import { env } from './config/env.js';

async function startServer() {
  await connectToDatabase();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`Backend listening on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Backend startup failed', error);
  process.exit(1);
});
