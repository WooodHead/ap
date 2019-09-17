import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/services/http/http.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { DialerCampaign, UserGroup } from '@dialer/models/campaign.model';
import { DialerRedial } from '@dialer/models/redial.model';
import { Dial } from '@dialer/models/dial.model';
import { DialerStatus } from '@dialer/models/status.model';
import { DialerCallback } from '@dialer/models/callback.model';

@Injectable({
  providedIn: 'root',
})
export class DialerApiService {
  constructor(
    private http: HttpService,
  ) { }

  getCampaigns(): Observable<UserGroup> {
    return this.http.get('dialer/campaigns');
  }

  login(data) {
    return this.http.post('dialer/login', data);
  }

  logout() {
    return this.http.post('dialer/logout');
  }

  pause(data): Observable<any> {
    return this.http.post('dialer/pause', data);
  }

  unpause(data): Observable<any> {
    return this.http.post('dialer/unpause');
  }

  hangUp(): Observable<any> {
    return this.http.post('dialer/hangup');
  }

  dial(data: Dial): Observable<HttpResponse<any>> {
    return this.http.post('dialer/dial', data);
  }

  hold(onHoldState: boolean): Observable<HttpResponse<any>> {
    return this.http.post('dialer/hold', {onHoldState});
  }

  transfer(data: Dial): Observable<HttpResponse<any>> {
    return this.http.post('dialer/transfer', data);
  }

  setStatus(type: string, data: any): Observable<HttpResponse<any>> {
    return this.http.post(`dialer/${type}`, data);
  }

  updateLead(data: any): Observable<HttpResponse<any>> {
    return this.http.post(`dialer/update-lead`, data);
  }

  getCallbacks(): Observable<DialerCallback[]> {
    return this.http.get('dialer/callbacks');
  }

  getStatuses(): Observable<DialerStatus[]> {
    return this.http.get('dialer/statuses');
  }

  getRedial(): Observable<DialerRedial> {
    return this.http.get('dialer/redial');
  }
}
