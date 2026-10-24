import { Money } from '../../../shared/domain/api-response';
import { nightsBetween } from '../../../shared/validators/search-criteria.validators';

export interface CheckoutHotel {
  readonly id: string;
  readonly name: string;
  readonly destinationCode: string;
  readonly imageUrl: string;
  readonly rating: number;
  readonly nightlyPrice: Money;
  readonly amenities: readonly string[];
}

export interface BookingCriteria {
  readonly destination: string;
  readonly checkIn: string;
  readonly checkOut: string;
  readonly adults: number;
  readonly children: number;
}

export interface BookingDraft {
  readonly hotel: CheckoutHotel;
  readonly criteria: BookingCriteria;
  readonly nights: number;
  readonly total: Money;
}

export function createBookingDraft(
  hotel: CheckoutHotel,
  criteria: BookingCriteria,
): BookingDraft | null {
  const nights = nightsBetween(criteria.checkIn, criteria.checkOut);
  if (
    nights < 1 ||
    !Number.isInteger(criteria.adults) ||
    criteria.adults < 1 ||
    !Number.isInteger(criteria.children) ||
    criteria.children < 0
  ) {
    return null;
  }

  return {
    hotel,
    criteria,
    nights,
    total: {
      amount: hotel.nightlyPrice.amount * nights,
      currency: 'BRL',
    },
  };
}
