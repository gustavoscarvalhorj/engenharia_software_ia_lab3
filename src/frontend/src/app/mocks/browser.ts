import { setupWorker } from 'msw/browser';
import { hotelHandlers } from './handlers/hotel.handlers';

export const mockWorker = setupWorker(...hotelHandlers);
