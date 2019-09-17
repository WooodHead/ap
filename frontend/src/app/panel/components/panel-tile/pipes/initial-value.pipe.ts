import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initialValue',
})
export class InitialValuePipe implements PipeTransform {
  transform(value: any, denyEmpty = false): any {
    return (
      value === undefined
      || value === null
      || (denyEmpty && value === '')
    ) ? 'N/A' : value;
  }
}
