import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Authenticate } from '@app/auth/models/authenticate.model';
import { Agent } from '@app/auth/models/agent.model';
import { HttpService } from '@app/core/services/http/http.service';

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) {}

  login(data: Authenticate): Observable<Agent> {
    return this.httpService.post('call-center/login', data);
  }

  logout(agent: number): Observable<boolean> {
    return this.httpService.post('call-center/logout', { agent });
  }
}
