import {
  nightsBetween
} from "./chunk-LQNP6UUD.js";
import "./chunk-3FMBEB3S.js";

// src/app/features/checkout/domain/booking-draft.ts
function createBookingDraft(hotel2, criteria) {
  const nights = nightsBetween(criteria.checkIn, criteria.checkOut);
  if (nights < 1 || !Number.isInteger(criteria.adults) || criteria.adults < 1 || !Number.isInteger(criteria.children) || criteria.children < 0) {
    return null;
  }
  return {
    hotel: hotel2,
    criteria,
    nights,
    total: {
      amount: hotel2.nightlyPrice.amount * nights,
      currency: "BRL"
    }
  };
}

// src/app/features/checkout/domain/booking-draft.spec.ts
var hotel = {
  id: "hotel-test",
  name: "Hotel Teste",
  destinationCode: "RIO",
  imageUrl: "/hotel.svg",
  rating: 4.5,
  nightlyPrice: { amount: 250, currency: "BRL" },
  amenities: []
};
describe("createBookingDraft", () => {
  it("calculates nights and the estimated total", () => {
    const draft = createBookingDraft(hotel, {
      destination: "RIO",
      checkIn: "2026-10-24",
      checkOut: "2026-10-27",
      adults: 1,
      children: 0
    });
    expect(draft?.nights).toBe(3);
    expect(draft?.total).toEqual({ amount: 750, currency: "BRL" });
  });
  it("rejects an invalid guest count", () => {
    const draft = createBookingDraft(hotel, {
      destination: "RIO",
      checkIn: "2026-10-24",
      checkOut: "2026-10-25",
      adults: 0,
      children: 0
    });
    expect(draft).toBeNull();
  });
});
//# sourceMappingURL=spec-booking-draft.spec.js.map
