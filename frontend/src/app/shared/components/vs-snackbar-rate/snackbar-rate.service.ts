import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import {
  VSSnackBarRateComponent,
} from '@app/shared/components/vs-snackbar-rate/vs-snackbar-rate.component';

const DEFAULT_CONFIG: MatSnackBarConfig = {
  duration: 5000,
  verticalPosition: 'top',
  panelClass: 'rate',
};

@Injectable()
export class SnackBarRateService {
  constructor(private snackBar: MatSnackBar) {}

  public open() {
    // TODO uncomment when rate bar logic finished
    // this.snackBar.openFromComponent(VSSnackBarRateComponent, DEFAULT_CONFIG);
  }
}
