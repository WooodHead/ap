import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { Contact } from './contacts-table/models/contact.model';
import { ContactsService } from './services/contacts.service';
import { tap } from 'rxjs/operators';

export class ContactsDataSource implements DataSource<Contact> {
  private contactsSubject = new BehaviorSubject<Contact[]>([]);

  constructor(private contactsService: ContactsService, contacts: Contact[]) {
    this.contactsSubject.next(contacts);
  }

  connect(): Observable<Contact[]> {
    return this.contactsSubject.asObservable();
  }

  disconnect(): void {
    this.contactsSubject.complete();
  }

  delete(id: string) {
    return this.contactsService.deleteContact(id).pipe(
      tap(() => {
        this.contactsSubject.next(
          this.contactsSubject.getValue().filter(element => element._id !== id),
        );
      }),
    );
  }

  add(contact: Contact) {
    const newValue = this.contactsSubject.getValue().concat(contact);
    this.contactsSubject.next(newValue);
  }

  saveContact(contact: Contact) {
    return this.contactsService.saveContact(contact).pipe(
      tap(({ _id }) => {
        this.add({ ...contact, _id });
      }),
    );
  }

  updateContact(contact: Contact) {
    return this.contactsService.saveContact(contact).pipe(
      tap(() => {
        this.update(contact);
      }),
    );
  }

  update(contact: Contact) {
    const newValue = this.contactsSubject
      .getValue()
      .map(element => (element._id === contact._id ? contact : element));

    this.contactsSubject.next(newValue);
  }

  sort(options, favoritesFirst) {
    this.contactsSubject.next(
      this.contactsSubject.getValue().sort((a, b) => {
        if (favoritesFirst && a.isFavorite !== b.isFavorite) {
          return a.isFavorite ? -1 : 1;
        }
        let compResult;
        if (options.active) {
          compResult = a[options.active] < b[options.active] ? -1 : 1;
          if (options.direction === 'desc') {
            compResult *= -1;
          }
        }
        return compResult;
      }),
    );
  }
}
