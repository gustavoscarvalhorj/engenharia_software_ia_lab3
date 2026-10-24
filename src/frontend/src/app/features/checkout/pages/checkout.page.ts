import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ObservabilityService } from '../../../core/observability/observability.service';
import { todayLocalIso } from '../../../shared/validators/search-criteria.validators';
import { CheckoutService } from '../data-access/checkout.service';
import {
  BookingCriteria,
  BookingDraft,
  createBookingDraft,
} from '../domain/booking-draft';

type CheckoutState =
  | { readonly kind: 'loading' }
  | { readonly kind: 'ready'; readonly draft: BookingDraft }
  | { readonly kind: 'invalid' }
  | { readonly kind: 'error'; readonly correlationId?: string };

@Component({
  selector: 'app-checkout-page',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CheckoutPage {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(CheckoutService);
  private readonly observability = inject(ObservabilityService);
  private readonly destroyRef = inject(DestroyRef);

  readonly state = signal<CheckoutState>({ kind: 'loading' });
  readonly searchQuery = signal<Record<string, string | number>>({});
  readonly draft = computed(() => {
    const state = this.state();
    return state.kind === 'ready' ? state.draft : null;
  });
  readonly errorState = computed(() => {
    const state = this.state();
    return state.kind === 'error' ? state : null;
  });
  private hotelId = '';
  private criteria: BookingCriteria | null = null;

  constructor() {
    const params = this.route.snapshot.queryParamMap;
    this.hotelId = params.get('hotelId') ?? '';
    this.criteria = {
      destination: params.get('destination') ?? '',
      checkIn: params.get('checkIn') ?? '',
      checkOut: params.get('checkOut') ?? '',
      adults: Number(params.get('adults')),
      children: Number(params.get('children')),
    };
    this.searchQuery.set({ ...this.criteria });

    if (!this.hasValidNavigation(this.hotelId, this.criteria)) {
      this.state.set({ kind: 'invalid' });
      return;
    }
    this.loadHotel();
  }

  retry(): void {
    if (this.criteria) {
      this.loadHotel();
    }
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(`${value}T12:00:00`));
  }

  private loadHotel(): void {
    this.state.set({ kind: 'loading' });
    this.service
      .hotelById(this.hotelId)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.state.set({ kind: 'invalid' });
          } else {
            this.state.set({
              kind: 'error',
              correlationId: error.error?.correlationId as string | undefined,
            });
          }
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        const draft = createBookingDraft(response.data, this.criteria!);
        if (!draft) {
          this.state.set({ kind: 'invalid' });
          return;
        }
        this.state.set({ kind: 'ready', draft });
        this.observability.track({
          event: 'checkout_viewed',
          destination: draft.criteria.destination,
          correlationId: response.correlationId,
        });
      });
  }

  private hasValidNavigation(hotelId: string, criteria: BookingCriteria): boolean {
    return (
      hotelId.length > 0 &&
      ['RIO', 'GO', 'BSB'].includes(criteria.destination) &&
      criteria.checkIn >= todayLocalIso() &&
      criteria.checkOut > criteria.checkIn &&
      Number.isInteger(criteria.adults) &&
      criteria.adults >= 1 &&
      Number.isInteger(criteria.children) &&
      criteria.children >= 0
    );
  }
}
