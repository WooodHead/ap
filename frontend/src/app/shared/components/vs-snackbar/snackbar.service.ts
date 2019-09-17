import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { VSSnackBarComponent } from '@app/shared/components/vs-snackbar/vs-snackbar.component';

const DEFAULT_CONFIG: MatSnackBarConfig = {
  duration: 3000,
  verticalPosition: 'top',
  panelClass: 'error',
};

@Injectable()
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  public open(data: any) {
    const config = Object.assign({ data }, DEFAULT_CONFIG);
    config.panelClass = data.type || 'error';
    if (typeof data === 'string') {
      config.data = { message: data };
    }

    // remove duration if action button provided
    if (data.action) {
      config.duration = 0;
    }

    this.snackBar.openFromComponent(VSSnackBarComponent, config);
  }
}
