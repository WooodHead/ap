import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/internal/operators';
import { RequestOptions } from '@app/core/services/http/request-options.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private config = {
    baseUrl: '/api/agent/',
  };

  private composeUrl(url: string, usePrefix = true) {
    return usePrefix ? `${this.config.baseUrl}${url}` : url;
  }

  constructor(private http: HttpClient) {}

  public delete(url: string, options: any = {}): Observable<any> {
    return this.http
      .delete(this.composeUrl(url, options.usePrefix), options)
      .pipe(
        catchError(this.handleError),
      );
  }

  public get(url: string, options: RequestOptions = {}): Observable<any> {
    return this.http
      .get(this.composeUrl(url, options.usePrefix))
      .pipe(
        catchError(this.handleError),
      );
  }

  public post(url: string, body: any = {}, options: any = {}): Observable<any> {
    return this.http
      .post(this.composeUrl(url, options.usePrefix), body, options)
      .pipe(
        catchError(this.handleError),
      );
  }

  public put(url: string, body: any = {}, options: any = {}): Observable<any> {
    return this.http
      .put(this.composeUrl(url, options.usePrefix), body, options)
      .pipe(
        catchError(this.handleError),
      );
  }

  // returns error object from HttpErrorResponse instance
  private handleError(rawError) {
    let error: any;

    if (rawError instanceof HttpErrorResponse) {
      error = rawError.error || {};
    } else {
      error = rawError.message ? rawError.message : JSON.stringify(rawError);
    }

    return throwError(error);
  }
}
