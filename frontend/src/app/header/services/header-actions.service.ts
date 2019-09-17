import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ModalService } from '@app/shared/modals';
import { DialpadModalComponent, ManualDialModalComponent } from '@app/header/modals/components';
import { CallsHistoryModalComponent } from '@app/header/modals/calls-history/calls-history-modal.component';
import { ContactsModalComponent } from '../modals/contacts/contacts-modal.component';

@Injectable({
  providedIn: 'root',
})
export class HeaderActionsService {

  constructor(
    private modalService: ModalService,
  ) {}

  manualDial(type = 'call'): Observable<{ phoneNumber: string }> {
    return this.modalService
      .open(ManualDialModalComponent, {
        panelClass: 'manual-dial-modal',
        width: '400px',
        data: { type },
      })
      .pipe(filter(value => !!value));
  }

  showDialpad(): Observable<{ phoneNumber: string }> {
    return this.modalService
      .open(DialpadModalComponent, {
        panelClass: 'dialpad-modal',
      })
      .pipe(filter(value => !!value));
  }

  showCallsHistory() {
    return this.modalService
      .open(
        CallsHistoryModalComponent, {
          width: '68vw',
          height: '175px',
          panelClass: 'dispo-modal',
          data: { mode: 'history' },
        },
      );
  }

  showContacts() {
    return this.modalService
      .open(
        ContactsModalComponent, {
          width: '58vw',
          height: '175px',
          panelClass: 'dispo-modal',
          data: { mode: 'contacts' },
        },
      );
  }
}
