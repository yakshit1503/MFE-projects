# SkyFare Audit Service

Small Spring Boot service for learning Java in this project without replacing the working Node/Express API.

The Node SkyFare backend creates the booking, then optionally posts an audit event here:

```text
POST http://localhost:4310/api/audits/bookings
```

Audit records are saved to MongoDB database `skyfare`, collection `skyfare_booking_audits`.

## Run

This project is set up for Java 8 with Spring Boot 2.7.x.

```powershell
mvn spring-boot:run
```

Use the same MongoDB environment values as the SkyFare Node backend:

```env
MONGODB_URI=mongodb://localhost:27017/skyfare
MONGODB_DB_NAME=skyfare
PORT=4310
```

For Atlas, put the Atlas URI in your environment or local Maven run configuration. Do not commit real credentials.
