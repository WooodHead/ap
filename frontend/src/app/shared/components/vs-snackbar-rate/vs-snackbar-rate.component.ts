import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
import { Store } from '@ngxs/store';
import { RateCall } from '@app/panel/store/panel.actions';

@Component({
  selector: 'vs-snackbar-rate',
  templateUrl: './vs-snackbar-rate.component.html',
  styleUrls: ['./vs-snackbar-rate.component.scss'],
})
export class VSSnackBarRateComponent {
  rates = [1, 2, 3, 4, 5];
  hoveredRate = 0;

  constructor(
    private snackBarRef: MatSnackBarRef<VSSnackBarRateComponent>,
    private store: Store,
  ) {}

  rate(rate: number) {
    this.store
      .dispatch(new RateCall(rate))
      .subscribe(() => this.snackBarRef.dismiss());
  }
}
