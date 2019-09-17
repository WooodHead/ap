import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: any): any {
    return this.calc(value);
  }

  calc(value) {
    let secondsDiff = value;

    const seconds = Math.floor(secondsDiff % 60);
    secondsDiff /= 60;

    const minutes = Math.floor(secondsDiff % 60);
    secondsDiff /= 60;

    const hours = Math.floor(secondsDiff % 24);

    const res = [];

    if (hours) {
      res.push(hours + 'h');
    }

    if (minutes) {
      res.push(minutes + 'm');
    }

    res.push(seconds + 's');

    return res.join(' ');
  }
}
