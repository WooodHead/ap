import { HttpService } from '@app/core/services/http/http.service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SnackBarService } from '@app/shared/components/vs-snackbar/snackbar.service';
import { Contact } from '../contacts-table/models/contact.model';

@Injectable()
export class ContactsService {
  loading = new BehaviorSubject(false);
  loading$ = this.loading.asObservable();

  private serviceUrl = 'contacts';

  constructor(private http: HttpService, private snackBarService: SnackBarService) {}

  getContacts(): Observable<Contact[]> {
    this.loading.next(true);
    return this.http.get(`${this.serviceUrl}`).pipe(tap(() => this.loading.next(false)));
  }

  saveContact(contact: Contact): Observable<{ _id?: string; message?: string }> {
    this.loading.next(true);

    const req = !!contact._id
      ? this.http.put(`${this.serviceUrl}/${contact._id}`, contact)
      : this.http.post(`${this.serviceUrl}`, contact);

    return req.pipe(
      catchError(error => {
        this.snackBarService.open({
          message: 'panel.contacts-table.unable-to-save-message',
        });
        this.loading.next(false);
        return error;
      }),
      tap(() => {
        this.snackBarService.open({
          message: 'panel.contacts-table.saved-message',
          type: 'info',
        });
        this.loading.next(false);
      }),
    );
  }

  deleteContact(id: string): Observable<{ message: string }> {
    this.loading.next(true);

    return this.http.delete(`${this.serviceUrl}/${id}`).pipe(
      catchError(error => {
        this.snackBarService.open({
          message: 'panel.contacts-table.unable-to-delete-message',
        });
        this.loading.next(false);
        return error;
      }),
      tap(() => {
        this.snackBarService.open({
          message: 'panel.contacts-table.deleted-message',
          type: 'info',
        });
        this.loading.next(false);
      }),
    );
  }

}
