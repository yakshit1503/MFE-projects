import { env } from '../config/env.js';

export type SkyscannerPlace = {
  entityId: string;
  iataCode: string;
  name: string;
  cityName: string;
  countryName: string;
  type: string;
  hierarchy: string;
};

type SkyscannerAutosuggestResponse = {
  places?: SkyscannerPlace[];
};

const localPlaceFallbacks: SkyscannerPlace[] = [
  { entityId: 'local-yyz', iataCode: 'YYZ', name: 'Toronto Pearson International', cityName: 'Toronto', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Toronto, Ontario, Canada' },
  { entityId: 'local-yvr', iataCode: 'YVR', name: 'Vancouver International', cityName: 'Vancouver', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Vancouver, British Columbia, Canada' },
  { entityId: 'local-yul', iataCode: 'YUL', name: 'Montreal-Trudeau International', cityName: 'Montreal', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Montreal, Quebec, Canada' },
  { entityId: 'local-yyc', iataCode: 'YYC', name: 'Calgary International', cityName: 'Calgary', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Calgary, Alberta, Canada' },
  { entityId: 'local-yow', iataCode: 'YOW', name: 'Ottawa International', cityName: 'Ottawa', countryName: 'Canada', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Ottawa, Ontario, Canada' },
  { entityId: 'local-jfk', iataCode: 'JFK', name: 'John F. Kennedy International', cityName: 'New York', countryName: 'United States', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'New York, United States' },
  { entityId: 'local-ewr', iataCode: 'EWR', name: 'Newark Liberty International', cityName: 'Newark', countryName: 'United States', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Newark, New Jersey, United States' },
  { entityId: 'local-lax', iataCode: 'LAX', name: 'Los Angeles International', cityName: 'Los Angeles', countryName: 'United States', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Los Angeles, California, United States' },
  { entityId: 'local-ord', iataCode: 'ORD', name: "Chicago O'Hare International", cityName: 'Chicago', countryName: 'United States', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Chicago, Illinois, United States' },
  { entityId: 'local-lhr', iataCode: 'LHR', name: 'Heathrow', cityName: 'London', countryName: 'United Kingdom', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'London, United Kingdom' },
  { entityId: 'local-cdg', iataCode: 'CDG', name: 'Charles de Gaulle', cityName: 'Paris', countryName: 'France', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Paris, France' },
  { entityId: 'local-dxb', iataCode: 'DXB', name: 'Dubai International', cityName: 'Dubai', countryName: 'United Arab Emirates', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Dubai, United Arab Emirates' },
  { entityId: 'local-del', iataCode: 'DEL', name: 'Indira Gandhi International', cityName: 'Delhi', countryName: 'India', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Delhi, India' },
  { entityId: 'local-bom', iataCode: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', cityName: 'Mumbai', countryName: 'India', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Mumbai, India' },
  { entityId: 'local-sin', iataCode: 'SIN', name: 'Singapore Changi', cityName: 'Singapore', countryName: 'Singapore', type: 'PLACE_TYPE_AIRPORT', hierarchy: 'Singapore' }
];

export async function searchSkyscannerPlaces(searchTerm: string, isDestination: boolean): Promise<SkyscannerPlace[]> {
  if (!env.skyscannerApiKey) {
    return searchLocalPlaceFallbacks(searchTerm);
  }

  const response = await fetch('https://partners.api.skyscanner.net/apiservices/v3/autosuggest/flights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.skyscannerApiKey
    },
    body: JSON.stringify({
      query: {
        market: env.skyscannerMarket,
        locale: env.skyscannerLocale,
        searchTerm,
        includedEntityTypes: ['PLACE_TYPE_CITY', 'PLACE_TYPE_AIRPORT']
      },
      limit: 10,
      isDestination
    })
  });

  if (!response.ok) {
    throw new Error(`Skyscanner Autosuggest responded with ${response.status}.`);
  }

  const data = (await response.json()) as SkyscannerAutosuggestResponse;
  return data.places ?? [];
}

function searchLocalPlaceFallbacks(searchTerm: string): SkyscannerPlace[] {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return localPlaceFallbacks.slice(0, 8);
  }

  return localPlaceFallbacks
    .filter((place) => `${place.cityName} ${place.iataCode} ${place.name} ${place.countryName}`.toLowerCase().includes(normalizedSearchTerm))
    .slice(0, 8);
}
