import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { UserState } from '@app/auth/store/user.state';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const sid = this.store.selectSnapshot(UserState.getSid);

    const pathname = window.location.pathname;

    let newRequest = request.clone();

    if (pathname !== '/') {
      newRequest = request.clone({
        url: (pathname + request.url).replace('//', '/'),
      });
    }

    if (sid) {
      newRequest = newRequest.clone({
        setHeaders: { sid },
      });
    }

    return next.handle(newRequest);
  }
}
