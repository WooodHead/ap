import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { DialerState } from '@dialer/store/dialer.state';

@Injectable()
export class DialerSessionDataInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method === 'POST' && request.url.includes('dialer')) {
      const sessionData = this.store.selectSnapshot(DialerState.getSessionData);

      if (sessionData) {
        let body = sessionData;

        if (request.body) {
          body = Object.assign(request.body, sessionData);
        }

        return next.handle(request.clone({ body }));
      }
    }

    return next.handle(request);
  }
}
