import { Component, Inject, OnInit } from '@angular/core';
import { VSModalComponent } from 'src/app/shared/modals/vs-modal/vs-modal.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { Contact } from './contacts-table/models/contact.model';
import { WebRTCService } from '@app/core/services/web-rtc/web-rtc.service';
import { ContactsDataSource } from './contacts-data-source';
import { ContactsService } from './services/contacts.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacts-modal',
  templateUrl: './contacts-modal.component.html',
  styleUrls: ['./contacts-modal.component.scss'],
  animations: [fadeAnimation],
})
export class ContactsModalComponent extends VSModalComponent implements OnInit {
  contact: Contact;
  contactsDataSource: ContactsDataSource;
  loading$: Observable<boolean>;

  constructor(
    dialogRef: MatDialogRef<VSModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: { mode: 'contacts' | 'contact' },
    public matDialogRef: MatDialogRef<ContactsModalComponent>,
    private contactsService: ContactsService,
    private webRTCService: WebRTCService,
  ) {
    super(dialogRef, data);
  }

  ngOnInit() {
    this.loading$ = this.contactsService.loading$;

    this.contactsService.getContacts().subscribe(contacts => {
      this.contactsDataSource = new ContactsDataSource(this.contactsService, contacts);
    });
  }

  setMode(mode: 'contacts' | 'contact') {
    this.data.mode = mode;
    if (mode === 'contacts') {
      this.matDialogRef.updateSize('58vw', '175px');
    } else {
      this.matDialogRef.updateSize('68vw', '141px');
    }
  }

  onCall(number) {
    this.webRTCService.call(number);
    this.close();
  }

  showEditContact(contact) {
    this.contact = contact || {};
    this.setMode('contact');
  }

  onAdded(contact) {
    this.contactsDataSource.saveContact(contact).subscribe(() => {
      this.setMode('contacts');
    });
  }

  onCancelled() {
    this.setMode('contacts');
  }

  onUpdated(contact: Contact) {
    this.contactsDataSource.updateContact(contact).subscribe(() => {
      this.setMode('contacts');
    });
  }

  close() {
    this.matDialogRef.close('Closed');
  }
}
