export interface ApiError {
  readonly code: string;
  readonly field?: string;
  readonly message: string;
}

export interface ApiResponse<T> {
  readonly status: 'success' | 'error';
  readonly message: string;
  readonly data: T;
  readonly errors: readonly ApiError[];
  readonly correlationId: string;
}

export interface Money {
  readonly amount: number;
  readonly currency: 'BRL';
}
