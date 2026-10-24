import { delay, http, HttpResponse } from 'msw';
import { DESTINATION_CODES, DestinationCode } from '../../features/hotel-search/domain/hotel.models';
import { todayLocalIso } from '../../shared/validators/search-criteria.validators';
import { destinations, hotels } from '../fixtures/hotels';

const success = <T>(data: T, message: string, correlationId: string) => ({
  status: 'success' as const,
  message,
  data,
  errors: [],
  correlationId,
});

const failure = (
  message: string,
  correlationId: string,
  code: string,
  field?: string,
) => ({
  status: 'error' as const,
  message,
  data: null,
  errors: [{ code, field, message }],
  correlationId,
});

function correlationId(request: Request): string {
  return request.headers.get('x-correlation-id') ?? crypto.randomUUID();
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export const hotelHandlers = [
  http.get('/api/v1/destinations', async ({ request }) => {
    await delay(180);
    return HttpResponse.json(
      success(destinations, 'Destinos encontrados.', correlationId(request)),
    );
  }),

  http.get('/api/v1/hotels', async ({ request }) => {
    await delay(320);
    const id = correlationId(request);
    const url = new URL(request.url);
    const destination = url.searchParams.get('destination');
    const checkIn = url.searchParams.get('checkIn') ?? '';
    const checkOut = url.searchParams.get('checkOut') ?? '';
    const adultsParam = url.searchParams.get('adults');
    const childrenParam = url.searchParams.get('children');
    const adults = Number(adultsParam);
    const children = Number(childrenParam);

    if (
      !DESTINATION_CODES.includes(destination as DestinationCode) ||
      !isValidDate(checkIn) ||
      !isValidDate(checkOut) ||
      checkIn < todayLocalIso() ||
      checkOut <= checkIn ||
      adultsParam === null ||
      childrenParam === null ||
      !Number.isInteger(adults) ||
      adults < 1 ||
      !Number.isInteger(children) ||
      children < 0
    ) {
      return HttpResponse.json(
        failure('Critérios de busca inválidos.', id, 'INVALID_SEARCH_CRITERIA'),
        { status: 400 },
      );
    }

    const scenario = request.headers.get('x-mock-scenario');
    if (scenario === 'error') {
      return HttpResponse.json(
        failure('Não foi possível processar a solicitação.', id, 'MOCK_TRANSIENT_ERROR'),
        { status: 503 },
      );
    }

    const items =
      scenario === 'empty'
        ? []
        : hotels.filter((hotel) => hotel.destinationCode === destination);
    return HttpResponse.json(
      success({ items, total: items.length }, 'Hotéis encontrados.', id),
    );
  }),

  http.get('/api/v1/hotels/:hotelId', async ({ params, request }) => {
    await delay(220);
    const id = correlationId(request);
    const hotel = hotels.find((item) => item.id === params['hotelId']);
    return hotel
      ? HttpResponse.json(success(hotel, 'Hotel encontrado.', id))
      : HttpResponse.json(failure('Hotel não encontrado.', id, 'HOTEL_NOT_FOUND'), {
          status: 404,
        });
  }),
];
