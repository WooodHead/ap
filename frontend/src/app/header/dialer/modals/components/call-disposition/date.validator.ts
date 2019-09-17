import { FormControl } from '@angular/forms';

export function dateValidator(control: FormControl) {
  const date = new Date(control.value);

  if (date.toString() === 'Invalid Date') {
    return { invalid: true };
  }

  return null;
}
