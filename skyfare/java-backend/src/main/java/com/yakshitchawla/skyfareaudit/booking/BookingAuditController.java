package com.yakshitchawla.skyfareaudit.booking;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audits/bookings")
public class BookingAuditController {

  private final BookingAuditRepository repository;

  public BookingAuditController(BookingAuditRepository repository) {
    this.repository = repository;
  }

  @PostMapping
  public BookingAuditEvent create(@RequestBody BookingAuditEvent event) {
    event.setId(null);

    if (event.getSource() == null || event.getSource().trim().isEmpty()) {
      event.setSource("skyfare-node-backend");
    }

    return repository.save(event);
  }

  @GetMapping
  public List<BookingAuditEvent> list() {
    return repository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
  }
}
