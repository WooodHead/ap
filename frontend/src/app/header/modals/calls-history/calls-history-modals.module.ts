import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/shared/material';
import { ModalsModule } from '@app/shared/modals';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '@app/shared/components';
import { EditContactModule } from '@app/shared/components/vs-edit-contact/edit-contact.module';
import { CallsHistoryModalComponent } from './calls-history-modal.component';
import { CallsHistoryService } from './services/calls-history.service';
import { CallsHistoryTableComponent } from './calls-history-table/calls-history-table.component';
import { ApplicationPipesModule } from '@app/shared/pipes/application-pipes.module';

@NgModule({
  imports: [
    ApplicationPipesModule,
    CommonModule,
    MaterialModule,
    ModalsModule,
    TranslateModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    EditContactModule,
  ],
  declarations: [CallsHistoryModalComponent, CallsHistoryTableComponent],
  exports: [CallsHistoryModalComponent],
  entryComponents: [CallsHistoryModalComponent],
  providers: [CallsHistoryService],
})
export class CallsHistoryModalsModule {}
