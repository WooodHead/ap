import { Component, Inject } from '@angular/core';
import { VSModalComponent } from '@app/shared/modals/vs-modal/vs-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Store } from '@ngxs/store';
import { DialerCallbacksState } from '@dialer/store/dialer-callbacks.state';

@Component({
  selector: 'app-callbacks-modal',
  templateUrl: './callbacks-modal.component.html',
  styleUrls: ['./callbacks-modal.component.scss'],
})
export class CallbacksModalComponent extends VSModalComponent {
  callbacks = this.store.selectSnapshot(DialerCallbacksState.getData);
  displayedColumns = [
    'datetime',
    'leadId',
    'campaignName',
    'firstName',
    'lastName',
    'phoneNumber',
    'comments',
    'action',
  ];

  constructor(
    dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private store: Store,
  ) {
    super(dialogRef, data);
  }
}
