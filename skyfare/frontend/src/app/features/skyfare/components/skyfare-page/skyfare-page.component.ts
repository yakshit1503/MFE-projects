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

type AirportOption = {
  entityId: string;
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
  type: string;
  hierarchy: string;
};

const API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4300/api'
    : `${window.location.origin}/api`;

const localAirportOptions: AirportOption[] = [
  { entityId: 'local-yyz', iataCode: 'YYZ', name: 'Toronto Pearson International', cityName: 'Toronto', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Toronto, Ontario, Canada' },
  { entityId: 'local-yvr', iataCode: 'YVR', name: 'Vancouver International', cityName: 'Vancouver', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Vancouver, British Columbia, Canada' },
  { entityId: 'local-yul', iataCode: 'YUL', name: 'Montreal-Trudeau International', cityName: 'Montreal', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Montreal, Quebec, Canada' },
  { entityId: 'local-yyc', iataCode: 'YYC', name: 'Calgary International', cityName: 'Calgary', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Calgary, Alberta, Canada' },
  { entityId: 'local-yow', iataCode: 'YOW', name: 'Ottawa International', cityName: 'Ottawa', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Ottawa, Ontario, Canada' },
  { entityId: 'local-jfk', iataCode: 'JFK', name: 'John F. Kennedy International', cityName: 'New York', countryName: 'United States', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'New York, United States' },
  { entityId: 'local-lax', iataCode: 'LAX', name: 'Los Angeles International', cityName: 'Los Angeles', countryName: 'United States', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Los Angeles, California, United States' },
  { entityId: 'local-lhr', iataCode: 'LHR', name: 'Heathrow', cityName: 'London', countryName: 'United Kingdom', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'London, United Kingdom' },
  { entityId: 'local-cdg', iataCode: 'CDG', name: 'Charles de Gaulle', cityName: 'Paris', countryName: 'France', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Paris, France' },
  { entityId: 'local-dxb', iataCode: 'DXB', name: 'Dubai International', cityName: 'Dubai', countryName: 'United Arab Emirates', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Dubai, United Arab Emirates' },
  { entityId: 'local-del', iataCode: 'DEL', name: 'Indira Gandhi International', cityName: 'Delhi', countryName: 'India', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Delhi, India' },
  { entityId: 'local-bom', iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', cityName: 'Mumbai', countryName: 'India', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Mumbai, India' }
];

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
  protected originQuery = 'Toronto';
  protected destinationQuery = 'Vancouver';
  protected readonly originSuggestions = signal<AirportOption[]>([]);
  protected readonly destinationSuggestions = signal<AirportOption[]>([]);
  protected readonly originLookupMessage = signal('Click or type at least 2 characters to search Skyscanner places.');
  protected readonly destinationLookupMessage = signal('Click or type at least 2 characters to search Skyscanner places.');
  protected readonly activeAirportField = signal<'origin' | 'destination' | null>(null);
  protected departureDate = new Date().toISOString().slice(0, 10);
  protected passengers = 1;
  protected passengerName = 'John Doe';
  protected readonly results = signal<FlightResult[]>([]);
  protected readonly latestBooking = signal<FlightBooking | null>(null);
  protected readonly selectedFlight = signal<FlightResult | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');

  constructor() {
    void this.searchFlights();
  }

  protected async searchFlights(): Promise<void> {
    this.syncAirportSearchValues();
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

  protected onAirportQueryChange(field: 'origin' | 'destination', value: string): void {
    if (field === 'origin') {
      this.originQuery = value;
      this.origin = this.parseAirportValue(value, this.originSuggestions());
    } else {
      this.destinationQuery = value;
      this.destination = this.parseAirportValue(value, this.destinationSuggestions());
    }

    this.activeAirportField.set(field);
    void this.loadAirportSuggestions(field, value);
  }

  protected openAirportPanel(field: 'origin' | 'destination'): void {
    this.activeAirportField.set(field);
    void this.loadAirportSuggestions(field, field === 'origin' ? this.originQuery : this.destinationQuery);
  }

  protected selectAirport(field: 'origin' | 'destination', airport: AirportOption): void {
    const label = this.formatAirport(airport);

    if (field === 'origin') {
      this.originQuery = label;
      this.origin = airport.cityName || airport.name;
    } else {
      this.destinationQuery = label;
      this.destination = airport.cityName || airport.name;
    }

    this.activeAirportField.set(null);
  }

  protected closeAirportPanel(): void {
    setTimeout(() => this.activeAirportField.set(null), 120);
  }

  private syncAirportSearchValues(): void {
    this.origin = this.parseAirportValue(this.originQuery, this.originSuggestions());
    this.destination = this.parseAirportValue(this.destinationQuery, this.destinationSuggestions());
  }

  private formatAirport(airport: AirportOption): string {
    const code = airport.iataCode ? ` (${airport.iataCode})` : '';
    return `${airport.cityName || airport.name}${code}`;
  }

  private parseAirportValue(value: string, suggestions: AirportOption[]): string {
    const trimmedValue = value.trim();
    const airport = suggestions.find((option) => this.formatAirport(option).toLowerCase() === trimmedValue.toLowerCase());

    return airport?.cityName || airport?.name || trimmedValue;
  }

  private async loadAirportSuggestions(field: 'origin' | 'destination', query: string): Promise<void> {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      this.setAirportSuggestions(field, this.searchLocalAirports(normalizedQuery));
      this.setAirportLookupMessage(field, 'Type at least 2 characters to narrow the airport list.');
      return;
    }

    try {
      this.setAirportLookupMessage(field, 'Searching Skyscanner places...');
      const params = new URLSearchParams({
        searchTerm: normalizedQuery,
        isDestination: String(field === 'destination')
      });
      const response = await fetch(`${API_BASE_URL}/flights/places?${params.toString()}`);

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message ?? 'Unable to fetch airport suggestions.');
      }

      const data = (await response.json()) as { places: AirportOption[]; message?: string };
      this.setAirportSuggestions(field, data.places);
      this.setAirportLookupMessage(
        field,
        data.places.length ? '' : data.message ?? 'No Skyscanner places found. Try a city or airport code.'
      );
    } catch {
      const fallbackPlaces = this.searchLocalAirports(normalizedQuery);

      this.setAirportSuggestions(field, fallbackPlaces);
      this.setAirportLookupMessage(
        field,
        fallbackPlaces.length
          ? ''
          : 'Airport lookup is temporarily unavailable. Try a city name like Toronto, Vancouver, London, or Delhi.'
      );
    }
  }

  private searchLocalAirports(query: string): AirportOption[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return localAirportOptions.slice(0, 8);
    }

    return localAirportOptions
      .filter((airport) =>
        `${airport.cityName} ${airport.iataCode} ${airport.name} ${airport.countryName}`.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 8);
  }

  private setAirportSuggestions(field: 'origin' | 'destination', places: AirportOption[]): void {
    if (field === 'origin') {
      this.originSuggestions.set(places);
    } else {
      this.destinationSuggestions.set(places);
    }
  }

  private setAirportLookupMessage(field: 'origin' | 'destination', message: string): void {
    if (field === 'origin') {
      this.originLookupMessage.set(message);
    } else {
      this.destinationLookupMessage.set(message);
    }
  }
}
