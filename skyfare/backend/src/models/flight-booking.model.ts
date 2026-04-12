import { Schema, model } from 'mongoose';

export interface FlightBooking {
  flightId: string;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  passengerName: string;
  passengers: number;
  price: number;
  status: 'confirmed';
  bookingReference: string;
}

const flightBookingSchema = new Schema<FlightBooking>(
  {
    flightId: { type: String, required: true },
    airline: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureDate: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    passengerName: { type: String, required: true },
    passengers: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    status: { type: String, required: true, enum: ['confirmed'], default: 'confirmed' },
    bookingReference: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export const FlightBookingModel = model<FlightBooking>('FlightBooking', flightBookingSchema, 'skyfare_uat');
