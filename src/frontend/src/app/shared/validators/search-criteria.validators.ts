import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function parseLocalDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
}

export function todayLocalIso(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function notPastDate(today = todayLocalIso()): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = parseLocalDate(control.value);
    return date && control.value >= today ? null : { notPastDate: true };
  };
}

export const validStayPeriod: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const checkIn = parseLocalDate(control.get('checkIn')?.value);
  const checkOut = parseLocalDate(control.get('checkOut')?.value);
  return checkIn && checkOut && checkOut > checkIn ? null : { invalidStayPeriod: true };
};

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = parseLocalDate(checkIn);
  const end = parseLocalDate(checkOut);
  if (!start || !end || end <= start) {
    return 0;
  }
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}
