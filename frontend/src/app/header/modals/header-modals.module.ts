import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/shared/material';
import { ModalsModule } from '@app/shared/modals';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@app/shared/components';
import {
  ManualDialModalComponent,
  DialpadModalComponent,
} from './components';
import { CallsHistoryModalsModule } from './calls-history/calls-history-modals.module';
import { ContactsModalsModule } from './contacts/contacts-modals.module';

const COMPONENTS = [
  ManualDialModalComponent,
  DialpadModalComponent,
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ModalsModule,
    TranslateModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    CallsHistoryModalsModule,
    ContactsModalsModule,
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
})
export class HeaderModalsModule { }
