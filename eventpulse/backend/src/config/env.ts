import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4300),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/app-db',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200'
};
