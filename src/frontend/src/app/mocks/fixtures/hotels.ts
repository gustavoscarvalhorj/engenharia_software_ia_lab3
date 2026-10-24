import { Destination, Hotel } from '../../features/hotel-search/domain/hotel.models';

export const destinations: readonly Destination[] = [
  { code: 'RIO', name: 'Rio de Janeiro' },
  { code: 'GO', name: 'Goiás' },
  { code: 'BSB', name: 'Brasília' },
];

export const hotels: readonly Hotel[] = [
  {
    id: 'hotel-rio-001',
    name: 'Atlântico Copacabana',
    destinationCode: 'RIO',
    imageUrl: '/assets/hotels/rio.svg',
    rating: 4.7,
    nightlyPrice: { amount: 450, currency: 'BRL' },
    amenities: ['Wi-Fi', 'Café da manhã', 'Piscina'],
  },
  {
    id: 'hotel-rio-002',
    name: 'Vista Santa Teresa',
    destinationCode: 'RIO',
    imageUrl: '/assets/hotels/rio.svg',
    rating: 4.4,
    nightlyPrice: { amount: 360, currency: 'BRL' },
    amenities: ['Wi-Fi', 'Ar-condicionado'],
  },
  {
    id: 'hotel-go-001',
    name: 'Cerrado Hotel',
    destinationCode: 'GO',
    imageUrl: '/assets/hotels/goias.svg',
    rating: 4.6,
    nightlyPrice: { amount: 320, currency: 'BRL' },
    amenities: ['Café da manhã', 'Estacionamento'],
  },
  {
    id: 'hotel-bsb-001',
    name: 'Planalto Residence',
    destinationCode: 'BSB',
    imageUrl: '/assets/hotels/brasilia.svg',
    rating: 4.8,
    nightlyPrice: { amount: 510, currency: 'BRL' },
    amenities: ['Wi-Fi', 'Academia', 'Café da manhã'],
  },
];
