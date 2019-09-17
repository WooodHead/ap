import { FormControl } from '@angular/forms';

export function dateTimeValidator(control: FormControl) {
  const date = control.get('date').value;
  const time = control.get('time').value;

  const datetime = new Date(`${date} ${time}`);

  if (datetime.toString() === 'Invalid Date') {
    return { invalid: true };
  }

  if (datetime < new Date()) {
    return { old: true };
  }

  return null;
}
