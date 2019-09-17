import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject, BehaviorSubject } from 'rxjs';
import { tap, delay } from 'rxjs/internal/operators';

import { VSModalComponent } from '@app/shared/modals/vs-modal/vs-modal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { dateTimeValidator } from './date-time.validator';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { dateValidator } from './date.validator';
import { Select, Store } from '@ngxs/store';
import { DialerState } from '@dialer/store/dialer.state';
import { DialerSetStatus } from '@dialer/store/dialer.actions';
import { DialerGetCallbacks } from '@dialer/store/dialer-callbacks.actions';
import { DialerStatusState } from '@dialer/store/dialer-statuses.state';
import { ShowError } from '@app/panel/store/panel.actions';
import { LeadDispoInfo } from '@app/header/dialer/models/lead.model';

@Component({
  selector: 'app-call-disposition-modal',
  templateUrl: './call-disposition-modal.component.html',
  styleUrls: ['./call-disposition-modal.component.scss'],
  animations: [fadeAnimation],
})
export class CallDispositionModalComponent extends VSModalComponent implements OnInit, OnDestroy {
  @Select(DialerStatusState.getList) statuses$;

  lead: LeadDispoInfo;
  returnToPause = false;
  showCallback = false;

  formDispo: FormGroup = this.fb.group({
    status: [],
    comments: [''],
  });

  formCallback: FormGroup = this.fb.group({
    datetime: this.fb.group(
      {
        date: [
          this.formatDate(new Date()),
          [
            Validators.required,
            Validators.pattern('^\\d{2}\/\\d{2}\/\\d{4}$'),
            dateValidator,
          ],
        ],
        time: [
          this.formatTime(new Date()),
          [
            Validators.required,
            Validators.pattern('^([0-1][0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$'),
          ],
        ],
      },
      {
        validator: dateTimeValidator,
      },
    ),
    comments: [''],
  });

  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  submitted$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
  ) {
    super(dialogRef, data);

    const { comments } = this.store.selectSnapshot(DialerState.getLead);

    this.formDispo.get('comments').setValue(comments);
  }

  ngOnInit() {
    this.submitted$.subscribe(() => this.close());

    const lead = this.store.selectSnapshot(DialerState.getLead) || {};
    this.lead = new LeadDispoInfo(lead);    
  }

  ngOnDestroy() {
    this.submitted$.complete();
  }

  onSubmitDispo(returnToPause) {
    if (this.formDispo.invalid) {
      return;
    }
    this.loading$.next(true);

    const { status, comments } = this.formDispo.value;

    const data = {
      status,
      returnToPause,
      lead: {
        comments,
      },
    };

    this.store
      .dispatch(new DialerSetStatus('status', data))
      .subscribe(() => {
        this.submitted$.next();
        this.loading$.next(false);
      });
  }

  onSubmitCallback(returnToPause) {
    if (this.formCallback.invalid) {
      if (this.formCallback.get('datetime').errors) {
        const error = Object.keys(this.formCallback.get('datetime').errors)[0];

        this.store.dispatch(new ShowError(`panel.dialer.modals.date.${error}`));
      }

      return;
    }

    this.loading$.next(true);
    const { datetime, comments } = this.formCallback.value;

    const lead = this.store.selectSnapshot(DialerState.getLead);

    const data = {
      returnToPause,
      lead,
      comments,
      datetime: `${datetime.date} ${datetime.time}`,
    };


    this.store.dispatch(new DialerSetStatus('callback', data))
      .pipe(
        tap(() => {
          this.submitted$.next();
          this.loading$.next(false);
        }),
      )
      .pipe(delay(2000))
      .subscribe(() => {
        this.store.dispatch(new DialerGetCallbacks());
      });
  }

  private leadingZero(val) {
    return `0${val}`.slice(-2);
  }

  private formatDate(date) {
    return this.leadingZero(date.getMonth() + 1)
      + '/'
      + this.leadingZero(date.getDate())
      + '/'
      + date.getFullYear();
  }

  private formatTime(date) {
    return this.leadingZero(date.getHours() + 1) + ':00';
  }

}
