import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4300),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200'
};
