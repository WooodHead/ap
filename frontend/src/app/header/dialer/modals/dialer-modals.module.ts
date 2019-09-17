import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@app/shared/material';
import { ModalsModule } from '@app/shared/modals';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@app/shared/components';
import {
  CallDispositionModalComponent,
  CallbacksModalComponent,
  DisconnectModalComponent,
  RedialModalComponent,
} from './components';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const COMPONENTS = [
  CallDispositionModalComponent,
  CallbacksModalComponent,
  DisconnectModalComponent,
  RedialModalComponent,
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
  ],
  declarations: [
    ...COMPONENTS,
  ],
  exports: [...COMPONENTS],
  entryComponents: [...COMPONENTS],
})
export class DialerModalsModule { }
