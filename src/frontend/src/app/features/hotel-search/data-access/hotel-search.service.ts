import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/domain/api-response';
import {
  Destination,
  Hotel,
  HotelSearchResult,
  SearchCriteria,
} from '../domain/hotel.models';

@Injectable({ providedIn: 'root' })
export class HotelSearchService {
  private readonly http = inject(HttpClient);

  destinations(): Observable<ApiResponse<readonly Destination[]>> {
    return this.http.get<ApiResponse<readonly Destination[]>>('/api/v1/destinations');
  }

  search(criteria: SearchCriteria): Observable<ApiResponse<HotelSearchResult>> {
    const params = new HttpParams({ fromObject: { ...criteria } });
    return this.http.get<ApiResponse<HotelSearchResult>>('/api/v1/hotels', { params });
  }

  hotelById(id: string): Observable<ApiResponse<Hotel>> {
    return this.http.get<ApiResponse<Hotel>>(`/api/v1/hotels/${encodeURIComponent(id)}`);
  }
}
