import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/shared/material';
import { ModalsModule } from '@app/shared/modals';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@app/shared/components';
import { EditContactModule } from '@app/shared/components/vs-edit-contact/edit-contact.module';
import { ContactsModalComponent } from './contacts-modal.component';
import { ContactsTableModule } from './contacts-table/contacts-table.module';

const COMPONENTS = [
  ContactsModalComponent,
];

@NgModule({
  imports: [
    ContactsTableModule,
    CommonModule,
    MaterialModule,
    ModalsModule,
    TranslateModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    EditContactModule,
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
})
export class ContactsModalsModule { }
