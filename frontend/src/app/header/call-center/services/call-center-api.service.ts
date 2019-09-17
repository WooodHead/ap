import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/services/http/http.service';
import { Store } from '@ngxs/store';
import { UserState } from '@app/auth/store/user.state';

@Injectable({
  providedIn: 'root',
})
export class CallCenterService {

  constructor(
    private http: HttpService,
    private store: Store,
  ) {
  }

  hangUp(payload) {
    return this.http.post('call-center/hangup', payload);
  }

  pause(payload) {
    return this.http.post('call-center/pause', payload);
  }

  unpause(payload) {
    return this.http.post('call-center/unpause', payload);
  }

}
