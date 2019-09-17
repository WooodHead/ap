import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '@app/core/services/http/http.service';

@Injectable({
  providedIn: 'root',
})
export class PanelAPIService {
  constructor(private httpService: HttpService) {}

  rateCall(data): Observable<any> {
    return this.httpService.post('rate-call', data);
  }
}
