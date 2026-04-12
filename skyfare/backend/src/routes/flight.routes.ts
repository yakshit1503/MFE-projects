import { Router } from 'express';
import { FlightBookingModel } from '../models/flight-booking.model.js';
import { publishBookingAudit } from '../services/booking-audit.service.js';
import { searchSkyscannerPlaces } from '../services/skyscanner.service.js';

type FlightResult = {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  price: number;
  score: string;
};

const flightInventory = [
  { id: 'SF-101', airline: 'MapleJet', departureTime: '07:35', arrivalTime: '10:05', duration: '2h 30m', stops: 'Direct', basePrice: 286, score: 'Best' },
  { id: 'SF-208', airline: 'NorthAir', departureTime: '11:20', arrivalTime: '14:35', duration: '3h 15m', stops: '1 stop', basePrice: 244, score: 'Cheapest' },
  { id: 'SF-412', airline: 'BlueWing', departureTime: '18:10', arrivalTime: '20:45', duration: '2h 35m', stops: 'Direct', basePrice: 318, score: 'Fastest' },
  { id: 'SF-703', airline: 'Cloudline', departureTime: '21:00', arrivalTime: '00:40', duration: '3h 40m', stops: '1 stop', basePrice: 226, score: 'Smart Mix' }
];

export const flightRoutes = Router();

flightRoutes.get('/flights/places', async (request, response) => {
  const searchTerm = typeof request.query['searchTerm'] === 'string' ? request.query['searchTerm'].trim() : '';
  const isDestination = request.query['isDestination'] === 'true';

  if (!searchTerm || searchTerm.length < 2) {
    response.json({ places: [] });
    return;
  }

  try {
    const places = await searchSkyscannerPlaces(searchTerm, isDestination);
    response.json({ places });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to fetch Skyscanner places.';
    response.json({ places: [], message });
  }
});

flightRoutes.get('/flights/search', (request, response) => {
  const origin = normalizeCity(request.query['origin'], 'Toronto');
  const destination = normalizeCity(request.query['destination'], 'Vancouver');
  const departureDate = normalizeDate(request.query['departureDate']);
  const passengers = normalizePassengers(request.query['passengers']);

  const results: FlightResult[] = flightInventory.map((flight, index) => ({
    id: `${flight.id}-${origin.slice(0, 3).toUpperCase()}-${destination.slice(0, 3).toUpperCase()}`,
    airline: flight.airline,
    origin,
    destination,
    departureDate,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    duration: flight.duration,
    stops: flight.stops,
    price: flight.basePrice * passengers + index * 17,
    score: flight.score
  }));

  response.json({ results });
});

flightRoutes.post('/flights/bookings', async (request, response) => {
  const body = request.body as Partial<FlightResult> & { passengerName?: string; passengers?: number };

  if (!body.id || !body.airline || !body.origin || !body.destination || !body.departureDate || !body.passengerName) {
    response.status(400).json({ message: 'Flight and passenger details are required.' });
    return;
  }

  const bookingReference = `SKY-${Date.now().toString(36).toUpperCase()}`;
  const booking = await FlightBookingModel.create({
    flightId: body.id,
    airline: body.airline,
    origin: body.origin,
    destination: body.destination,
    departureDate: body.departureDate,
    departureTime: body.departureTime ?? 'TBD',
    arrivalTime: body.arrivalTime ?? 'TBD',
    passengerName: body.passengerName,
    passengers: normalizePassengers(body.passengers),
    price: Number(body.price ?? 0),
    status: 'confirmed',
    bookingReference
  });

  void publishBookingAudit({
    bookingReference: booking.bookingReference,
    flightId: booking.flightId,
    airline: booking.airline,
    origin: booking.origin,
    destination: booking.destination,
    passengerName: booking.passengerName,
    passengers: booking.passengers,
    price: booking.price,
    status: booking.status,
    source: 'skyfare-node-backend'
  });

  response.status(201).json({ booking });
});

flightRoutes.get('/flights/bookings', async (_request, response) => {
  const bookings = await FlightBookingModel.find().sort({ createdAt: -1 }).limit(10).lean();
  response.json({ bookings });
});

function normalizeCity(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeDate(value: unknown): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  return new Date().toISOString().slice(0, 10);
}

function normalizePassengers(value: unknown): number {
  const passengers = Number(value ?? 1);
  return Number.isFinite(passengers) && passengers > 0 ? Math.min(Math.floor(passengers), 9) : 1;
}
