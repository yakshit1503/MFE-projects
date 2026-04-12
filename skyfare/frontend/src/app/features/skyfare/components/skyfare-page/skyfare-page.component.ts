import { Component, ViewEncapsulation, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

type FlightBooking = FlightResult & {
  passengerName: string;
  passengers: number;
  bookingReference: string;
  status: 'confirmed';
};

const API_BASE_URL = 'http://localhost:4300/api';
const MAJOR_AIRPORTS = [
  { city: 'Toronto', code: 'YYZ', name: 'Toronto Pearson International' },
  { city: 'Vancouver', code: 'YVR', name: 'Vancouver International' },
  { city: 'Montreal', code: 'YUL', name: 'Montreal-Trudeau International' },
  { city: 'Calgary', code: 'YYC', name: 'Calgary International' },
  { city: 'Ottawa', code: 'YOW', name: 'Ottawa International' },
  { city: 'New York', code: 'JFK', name: 'John F. Kennedy International' },
  { city: 'Newark', code: 'EWR', name: 'Newark Liberty International' },
  { city: 'Chicago', code: 'ORD', name: "Chicago O'Hare International" },
  { city: 'Los Angeles', code: 'LAX', name: 'Los Angeles International' },
  { city: 'San Francisco', code: 'SFO', name: 'San Francisco International' },
  { city: 'Seattle', code: 'SEA', name: 'Seattle-Tacoma International' },
  { city: 'Miami', code: 'MIA', name: 'Miami International' },
  { city: 'Dallas', code: 'DFW', name: 'Dallas Fort Worth International' },
  { city: 'Atlanta', code: 'ATL', name: 'Hartsfield-Jackson Atlanta International' },
  { city: 'Denver', code: 'DEN', name: 'Denver International' },
  { city: 'London', code: 'LHR', name: 'Heathrow' },
  { city: 'Paris', code: 'CDG', name: 'Charles de Gaulle' },
  { city: 'Amsterdam', code: 'AMS', name: 'Amsterdam Schiphol' },
  { city: 'Frankfurt', code: 'FRA', name: 'Frankfurt Airport' },
  { city: 'Dubai', code: 'DXB', name: 'Dubai International' },
  { city: 'Doha', code: 'DOH', name: 'Hamad International' },
  { city: 'Delhi', code: 'DEL', name: 'Indira Gandhi International' },
  { city: 'Mumbai', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International' },
  { city: 'Singapore', code: 'SIN', name: 'Singapore Changi' },
  { city: 'Tokyo', code: 'HND', name: 'Tokyo Haneda' },
  { city: 'Hong Kong', code: 'HKG', name: 'Hong Kong International' },
  { city: 'Sydney', code: 'SYD', name: 'Sydney Kingsford Smith' }
] as const;

@Component({
  selector: 'app-skyfare-page',
  imports: [FormsModule],
  templateUrl: './skyfare-page.component.html',
  styleUrl: './skyfare-page.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SkyfarePageComponent {
  protected origin = 'Toronto';
  protected destination = 'Vancouver';
  protected readonly airports = MAJOR_AIRPORTS;
  protected departureDate = new Date().toISOString().slice(0, 10);
  protected passengers = 1;
  protected passengerName = 'Yakshit Chawla';
  protected readonly results = signal<FlightResult[]>([]);
  protected readonly latestBooking = signal<FlightBooking | null>(null);
  protected readonly selectedFlight = signal<FlightResult | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    void this.searchFlights();
  }

  protected async searchFlights(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const params = new URLSearchParams({
        origin: this.origin,
        destination: this.destination,
        departureDate: this.departureDate,
        passengers: String(this.passengers)
      });
      const response = await fetch(`${API_BASE_URL}/flights/search?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Unable to search flights right now.');
      }

      const data = (await response.json()) as { results: FlightResult[] };
      this.results.set(data.results);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to search flights right now.');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected openBooking(flight: FlightResult): void {
    this.selectedFlight.set(flight);
    this.latestBooking.set(null);
    this.errorMessage.set('');
  }

  protected closeBooking(): void {
    if (this.isLoading()) {
      return;
    }

    this.selectedFlight.set(null);
    this.latestBooking.set(null);
    this.errorMessage.set('');
  }

  protected async confirmBooking(): Promise<void> {
    const flight = this.selectedFlight();

    if (!flight) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const response = await fetch(`${API_BASE_URL}/flights/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...flight, passengerName: this.passengerName, passengers: this.passengers })
      });

      if (!response.ok) {
        throw new Error('Booking failed. Please confirm MongoDB and the SkyFare backend are running.');
      }

      const data = (await response.json()) as { booking: FlightBooking };
      this.latestBooking.set(data.booking);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Booking failed.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
