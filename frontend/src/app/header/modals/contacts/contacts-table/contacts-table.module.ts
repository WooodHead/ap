import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NgxsFormPluginModule } from '@ngxs/form-plugin';

import { MaterialModule } from '@app/shared/material';
import { MatSortModule } from '@angular/material/sort';
import { ComponentsModule } from '@app/shared/components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalsModule } from '@app/shared/modals';

import { EditContactModule } from '@app/shared/components/vs-edit-contact/edit-contact.module';
import { ContactsTableComponent } from './contacts-table.component';
import { ContactsService } from '../services/contacts.service';

export const COMPONENTS = [ContactsTableComponent];

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatSortModule,
    ComponentsModule,
    TranslateModule,
    ModalsModule,
    NgxsFormPluginModule,
    EditContactModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
  providers: [ContactsService],
})
export class ContactsTableModule {}
