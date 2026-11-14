import { CheckoutHotel, createBookingDraft } from './booking-draft';

const hotel: CheckoutHotel = {
  id: 'hotel-test',
  name: 'Hotel Teste',
  destinationCode: 'RIO',
  imageUrl: '/hotel.svg',
  rating: 4.5,
  nightlyPrice: { amount: 250, currency: 'BRL' },
  amenities: [],
};

describe('createBookingDraft', () => {
  it('calculates nights and the estimated total', () => {
    const draft = createBookingDraft(hotel, {
      destination: 'RIO',
      checkIn: '2026-10-24',
      checkOut: '2026-10-27',
      adults: 1,
      children: 0,
    });
    expect(draft?.nights).toBe(4); // QUEBRA PROPOSITAL: o correto é 3 (validação da pipeline de CI)
    expect(draft?.total).toEqual({ amount: 750, currency: 'BRL' });
  });

  it('rejects an invalid guest count', () => {
    const draft = createBookingDraft(hotel, {
      destination: 'RIO',
      checkIn: '2026-10-24',
      checkOut: '2026-10-25',
      adults: 0,
      children: 0,
    });
    expect(draft).toBeNull();
  });
});
