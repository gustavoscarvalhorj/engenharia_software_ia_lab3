import { FormControl, FormGroup } from '@angular/forms';
import {
  nightsBetween,
  notPastDate,
  validStayPeriod,
} from './search-criteria.validators';

describe('search criteria validators', () => {
  it('accepts a reservation starting today', () => {
    const control = new FormControl('2026-10-24', notPastDate('2026-10-24'));
    expect(control.valid).toBeTrue();
  });

  it('rejects a past date', () => {
    const control = new FormControl('2026-10-23', notPastDate('2026-10-24'));
    expect(control.hasError('notPastDate')).toBeTrue();
  });

  it('requires checkout after check-in', () => {
    const form = new FormGroup(
      {
        checkIn: new FormControl('2026-10-24'),
        checkOut: new FormControl('2026-10-24'),
      },
      { validators: validStayPeriod },
    );
    expect(form.hasError('invalidStayPeriod')).toBeTrue();
  });

  it('calculates nights across month boundaries', () => {
    expect(nightsBetween('2026-10-31', '2026-11-02')).toBe(2);
  });
});
