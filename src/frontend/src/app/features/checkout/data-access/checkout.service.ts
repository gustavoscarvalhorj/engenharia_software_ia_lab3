import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/domain/api-response';
import { CheckoutHotel } from '../domain/booking-draft';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly http = inject(HttpClient);

  hotelById(id: string): Observable<ApiResponse<CheckoutHotel>> {
    return this.http.get<ApiResponse<CheckoutHotel>>(
      `/api/v1/hotels/${encodeURIComponent(id)}`,
    );
  }
}
