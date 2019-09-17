import { Component, Inject, OnInit } from '@angular/core';
import { VSModalComponent } from 'src/app/shared/modals/vs-modal/vs-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { WebRTCService } from '@app/core/services/web-rtc/web-rtc.service';
import { CallsHistoryService } from './services/calls-history.service';
import { CallsHistory } from './models/calls-history.model';
import { Observable, combineLatest } from 'rxjs';
import { Store } from '@ngxs/store';
import { PanelState, PanelModeType } from '@app/panel/store/panel.state';
import { DialerDial } from '@dialer/store/dialer.actions';
import { Contact } from '../contacts/contacts-table/models/contact.model';
import { ContactsService } from '../contacts/services/contacts.service';
import { map } from 'rxjs/operators';

export interface Period {
  value: string;
  viewValue: string;
}

const PERIODS: Period[] = [
  { value: 'today', viewValue: 'Today' },
  { value: 'yesterday', viewValue: 'Yesterday' },
  { value: 'week', viewValue: 'Week' },
  { value: 'month', viewValue: 'Month' },
  { value: 'all', viewValue: 'All' },
];
@Component({
  selector: 'app-calls-history-modal',
  templateUrl: './calls-history-modal.component.html',
  styleUrls: ['./calls-history-modal.component.scss'],
  animations: [fadeAnimation],
})
export class CallsHistoryModalComponent extends VSModalComponent implements OnInit {
  periods = PERIODS;
  contact: Contact;
  period: 'today' | 'yesterday' | 'week' | 'month' | 'all' = 'today';
  $tableDataSource: Observable<CallsHistory[]> | any;
  panelMode: PanelModeType;
  loading$: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { mode: 'history' | 'contact' },
    dialogRef: MatDialogRef<VSModalComponent>,
    public matDialogRef: MatDialogRef<CallsHistoryModalComponent>,
    private webRTCService: WebRTCService,
    private callsHistoryService: CallsHistoryService,
    private contactsService: ContactsService,
    private store: Store,
  ) {
    super(dialogRef, data);
    
  }
  
  ngOnInit() {
    this.panelMode = this.store.selectSnapshot(PanelState.getMode);
    
    this.loading$ = combineLatest(
      this.callsHistoryService.loading$, 
      this.contactsService.loading$,
    ).pipe(map(([a, b]) => a || b));
    
    this.$tableDataSource = this.callsHistoryService.getCallsHistory(this.period);
  }

  setMode(mode: 'history' | 'contact') {
    this.data.mode = mode;
    if (mode === 'history') {
      this.matDialogRef.updateSize('68vw', '175px');
    } else {
      this.matDialogRef.updateSize('68vw', '141px');
    }
  }

  onPeriodChange(event) {
    this.period = event.value;
    this.$tableDataSource = this.callsHistoryService.getCallsHistory(this.period);
    console.log(this.period);
  }

  onAddContact(contact) {
    this.contact = contact;
    this.setMode('contact');
  }

  onSaveContact(contact) {
    // Called on contact save
    this.contactsService.saveContact(contact).subscribe(() => {
      this.setMode('history');
    });
  }

  onCall({ leadId, callerNumber }) {
    if (this.panelMode === 'call-center') {
      this.webRTCService.call(callerNumber);
    } else {
      this.store.dispatch(new DialerDial({ leadId, phoneNumber: callerNumber }));
    }

    this.close();
  }

  onCancelled() {
    this.setMode('history');
  }

  close() {
    this.matDialogRef.close('Closed');
  }
}
