package com.yakshitchawla.skyfareaudit.booking;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookingAuditRepository extends MongoRepository<BookingAuditEvent, String> {
}
