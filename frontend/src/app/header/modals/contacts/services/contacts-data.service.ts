import { Injectable } from "@angular/core";
import { Contact } from "../contacts-table/models/contact.model";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ContactsDataService {
  contacts: Contact[];
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  
  constructor() {

  }

  loadContacts(contacts: Contact[]) {
    this.contactsSubject.next(contacts);
  }

  add(contact: Contact) {
    const newValue = this.contactsSubject.getValue().concat(contact);
    this.contactsSubject.next(newValue);
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