import { Component, ViewEncapsulation, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShellSharedStateService } from '../../../../shared/state/shell-shared-state.service';

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

@Component({
  selector: 'app-skyfare-page',
  imports: [FormsModule],
  templateUrl: './skyfare-page.component.html',
  styleUrl: './skyfare-page.component.scss',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SkyfarePageComponent {
  protected readonly hostState;
  protected readonly summary;
  protected origin = 'Toronto';
  protected destination = 'Vancouver';
  protected departureDate = new Date().toISOString().slice(0, 10);
  protected passengers = 1;
  protected passengerName = 'Yakshit Chawla';
  protected readonly results = signal<FlightResult[]>([]);
  protected readonly latestBooking = signal<FlightBooking | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor(shellSharedStateService: ShellSharedStateService) {
    this.hostState = shellSharedStateService.state;
    this.summary = computed(
      () =>
        `${this.hostState().userName} is targeting ${this.hostState().audience} travel demand in ${this.hostState().city} for ${this.hostState().timeframe}.`
    );

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

  protected async bookFlight(flight: FlightResult): Promise<void> {
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
