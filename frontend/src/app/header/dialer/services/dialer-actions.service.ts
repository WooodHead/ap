import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { ModalService } from '@app/shared/modals';
import {
  RedialModalComponent,
  CallDispositionModalComponent,
  CallbacksModalComponent,
  DisconnectModalComponent,
} from '@dialer/modals/components';
import { DialerSetStatus } from '@dialer/store/dialer.actions';
import { ConfigService } from '@app/core/services/config/config.service';

@Injectable({
  providedIn: 'root',
})
export class DialerActionsService {

  constructor(
    private modalService: ModalService,
    private config: ConfigService,
    private store: Store,
  ) {}

  redial(): Observable<{ phoneNumber: string }> {
    return this.modalService.open(
      RedialModalComponent,
      {
        panelClass: 'redial-modal',
        width: '400px',
      },
    )
    .pipe(filter(number => !!number));
  }

  showDispoModal() {
    if (this.config.enableDispositionModal) {
      return this.modalService
      .open(CallDispositionModalComponent, {
        panelClass: 'dispo-modal',
        width: '1000px',
        disableClose: true,
      });
    }

    // If modal disabled - Auto-disposition
    return this.store
      .dispatch(new DialerSetStatus('status', {
        status: 'A',
        returnToPause: true,
        lead: {
          comments: '',
        },
      }));
  }

  switchToCallCenter() {
    return this.modalService.openConfirm('callCenter');
  }

  showCallbacks() {
    return this.modalService
      .open(
        CallbacksModalComponent, {
          panelClass: 'callbacks-modal',
          width: '1000px',
        },
      )
      .pipe(filter(dial => !!dial));
  }

  showDisconnectModal() {
    return this.modalService
      .open(
        DisconnectModalComponent, {
          width: '400px',
          disableClose: true,
        },
      );
  }

}
