import { env } from '../config/env.js';

type BookingAuditPayload = {
  bookingReference: string;
  flightId: string;
  airline: string;
  origin: string;
  destination: string;
  passengerName: string;
  passengers: number;
  price: number;
  status: string;
  source: string;
};

export async function publishBookingAudit(payload: BookingAuditPayload): Promise<void> {
  if (!env.bookingAuditServiceUrl) {
    return;
  }

  try {
    const response = await fetch(env.bookingAuditServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`Booking audit service responded with ${response.status}.`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown audit service error.';
    console.warn(`Booking audit service unavailable: ${message}`);
  }
}
