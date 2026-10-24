import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'hotels',
    loadComponent: () => import('./features/hotel-search/pages/hotel-search.page'),
    title: 'Buscar hotéis | Refúgio',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/pages/checkout.page'),
    title: 'Resumo da estadia | Refúgio',
  },
  { path: '', pathMatch: 'full', redirectTo: 'hotels' },
  { path: '**', redirectTo: 'hotels' },
];
