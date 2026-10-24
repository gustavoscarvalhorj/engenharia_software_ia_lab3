import { Money } from '../../../shared/domain/api-response';

export const DESTINATION_CODES = ['RIO', 'GO', 'BSB'] as const;
export type DestinationCode = (typeof DESTINATION_CODES)[number];

export interface Destination {
  readonly code: DestinationCode;
  readonly name: string;
}

export interface SearchCriteria {
  readonly destination: DestinationCode;
  readonly checkIn: string;
  readonly checkOut: string;
  readonly adults: number;
  readonly children: number;
}

export interface Hotel {
  readonly id: string;
  readonly name: string;
  readonly destinationCode: DestinationCode;
  readonly imageUrl: string;
  readonly rating: number;
  readonly nightlyPrice: Money;
  readonly amenities: readonly string[];
}

export interface HotelSearchResult {
  readonly items: readonly Hotel[];
  readonly total: number;
}
