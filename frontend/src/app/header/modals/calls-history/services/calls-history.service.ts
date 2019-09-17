import { HttpService } from '@app/core/services/http/http.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { CallsHistory } from '../models/calls-history.model';
import { PanelState } from '@app/panel/store/panel.state';
import { Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';

@Injectable()
export class CallsHistoryService {
  loading = new BehaviorSubject(false);
  loading$ = this.loading.asObservable();

  constructor(private store: Store, private http: HttpService) {}

  getCallsHistory(period: string): Observable<CallsHistory[]> {
    const mode = this.store.selectSnapshot(PanelState.getMode);
    this.loading.next(true);

    return this.http
      .get(`${mode}/calls-history/?date-range=${period}`)
      .pipe(tap(() => this.loading.next(false)));
  }
}
