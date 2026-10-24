import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, Subject, switchMap } from 'rxjs';
import { ObservabilityService } from '../../../core/observability/observability.service';
import {
  notPastDate,
  todayLocalIso,
  validStayPeriod,
} from '../../../shared/validators/search-criteria.validators';
import { HotelSearchService } from '../data-access/hotel-search.service';
import {
  Destination,
  DestinationCode,
  Hotel,
  SearchCriteria,
} from '../domain/hotel.models';

type SearchState =
  | { readonly kind: 'initial' }
  | { readonly kind: 'loading' }
  | { readonly kind: 'results'; readonly hotels: readonly Hotel[] }
  | { readonly kind: 'empty' }
  | { readonly kind: 'error'; readonly message: string; readonly correlationId?: string };

@Component({
  selector: 'app-hotel-search-page',
  imports: [ReactiveFormsModule, CurrencyPipe, DecimalPipe],
  templateUrl: './hotel-search.page.html',
  styleUrl: './hotel-search.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HotelSearchPage {
  private readonly service = inject(HotelSearchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly observability = inject(ObservabilityService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchRequests = new Subject<SearchCriteria>();
  private lastCriteria: SearchCriteria | null = null;
  private startedAt = 0;

  readonly today = todayLocalIso();
  readonly destinations = signal<readonly Destination[]>([]);
  readonly destinationsError = signal(false);
  readonly state = signal<SearchState>({ kind: 'initial' });
  readonly errorState = computed(() => {
    const state = this.state();
    return state.kind === 'error' ? state : null;
  });
  readonly resultHotels = computed(() => {
    const state = this.state();
    return state.kind === 'results' ? state.hotels : [];
  });

  readonly form = new FormGroup(
    {
      destination: new FormControl<DestinationCode | ''>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/^(RIO|GO|BSB)$/)],
      }),
      checkIn: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, notPastDate()],
      }),
      checkOut: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, notPastDate()],
      }),
      adults: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      children: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)],
      }),
    },
    { validators: [validStayPeriod] },
  );

  constructor() {
    this.reloadDestinations();
    this.searchRequests
      .pipe(
        switchMap((criteria) => {
          this.startedAt = performance.now();
          this.state.set({ kind: 'loading' });
          this.observability.track({ event: 'search_submitted', destination: criteria.destination });
          return this.service.search(criteria).pipe(
            catchError((error: HttpErrorResponse) => {
              const correlationId = error.error?.correlationId as string | undefined;
              this.state.set({
                kind: 'error',
                message: 'Não foi possível buscar hotéis. Tente novamente.',
                correlationId,
              });
              this.observability.track({
                event: 'search_failed',
                destination: criteria.destination,
                durationMs: Math.round(performance.now() - this.startedAt),
                correlationId,
              });
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        const hotels = response.data.items;
        this.state.set(hotels.length ? { kind: 'results', hotels } : { kind: 'empty' });
        this.observability.track({
          event: hotels.length ? 'search_succeeded' : 'search_empty',
          destination: this.lastCriteria?.destination,
          durationMs: Math.round(performance.now() - this.startedAt),
          resultCount: hotels.length,
          correlationId: response.correlationId,
        });
      });
    this.restoreSearch();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.lastCriteria = this.form.getRawValue() as SearchCriteria;
    this.searchRequests.next(this.lastCriteria);
  }

  retry(): void {
    if (this.lastCriteria) {
      this.searchRequests.next(this.lastCriteria);
    }
  }

  selectHotel(hotel: Hotel): void {
    if (!this.lastCriteria) {
      return;
    }
    void this.router.navigate(['/checkout'], {
      queryParams: { hotelId: hotel.id, ...this.lastCriteria },
    });
  }

  hasError(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  reloadDestinations(): void {
    this.destinationsError.set(false);
    this.service
      .destinations()
      .pipe(
        catchError(() => {
          this.destinationsError.set(true);
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => this.destinations.set(response.data));
  }

  private restoreSearch(): void {
    const params = this.route.snapshot.queryParamMap;
    const destination = params.get('destination') as DestinationCode | null;
    if (!destination) {
      return;
    }
    this.form.setValue({
      destination,
      checkIn: params.get('checkIn') ?? '',
      checkOut: params.get('checkOut') ?? '',
      adults: Number(params.get('adults')),
      children: Number(params.get('children')),
    });
    if (this.form.valid) {
      this.submit();
    }
  }
}
