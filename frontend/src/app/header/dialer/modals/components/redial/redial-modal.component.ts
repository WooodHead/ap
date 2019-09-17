import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VSModalComponent } from '@app/shared/modals/vs-modal/vs-modal.component';
import { Store, Select } from '@ngxs/store';
import { DialerRedialState } from '@dialer/store/dialer-redial.state';
import { DialerGetRedial } from '@dialer/store/dialer-redial.actions';

@Component({
  selector: 'app-redial-modal',
  templateUrl: './redial-modal.component.html',
  styleUrls: ['./redial-modal.component.scss'],
})
export class RedialModalComponent extends VSModalComponent implements OnInit {
  @Select(DialerRedialState.getLoading) loading$;
  @Select(DialerRedialState.getFullName) fullName$;
  @Select(DialerRedialState.getData) redialData$;

  constructor(
    dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private store: Store,
  ) {
    super(dialogRef, data);
  }

  ngOnInit() {
    this.store.dispatch(new DialerGetRedial());
  }

  dial() {
    const { leadId, phoneNumber } = this.store.selectSnapshot(DialerRedialState.getData);

    this.close({ leadId, phoneNumber });
  }
}
