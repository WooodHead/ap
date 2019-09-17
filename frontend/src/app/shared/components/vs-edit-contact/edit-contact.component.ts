import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { Contact } from '@app/header/modals/contacts/contacts-table/models/contact.model';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
  animations: [fadeAnimation],
})
export class EditContactComponent implements OnInit {
  contactForm: FormGroup;
  id: string;

  @Input() contact: Contact;
  @Output() added = new EventEmitter();
  @Output() cancelled = new EventEmitter();
  @Output() updated = new EventEmitter();
  
  constructor(
    private formBuilder: FormBuilder,
  ) {}

  close() {
    this.cancelled.emit();
  }

  save() {
    // FIXME: Could only one. Save, without updtae and added;
    if (this.contact._id) {
      this.updated.emit({ ...this.contactForm.value, _id: this.contact._id });
    } else {
      this.added.emit(this.contactForm.value);
    }
  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      isFavorite: [false],
      lastName: ['', Validators.required],
      note: [''],
      number: ['', Validators.required],
    });
    this.contactForm.patchValue(this.contact);
  }
}
