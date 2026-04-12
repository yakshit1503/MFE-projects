import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT ?? 4300),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/skyfare',
  mongodbDbName: process.env.MONGODB_DB_NAME ?? 'skyfare',
  bookingAuditServiceUrl: process.env.BOOKING_AUDIT_SERVICE_URL ?? '',
  skyscannerApiKey: process.env.SKYSCANNER_API_KEY ?? '',
  skyscannerMarket: process.env.SKYSCANNER_MARKET ?? 'CA',
  skyscannerLocale: process.env.SKYSCANNER_LOCALE ?? 'en-CA',
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200'
};
