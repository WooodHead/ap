import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditContactComponent } from './edit-contact.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@app/shared/material';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, MaterialModule],
  declarations: [EditContactComponent],
  exports: [EditContactComponent],
})
export class EditContactModule {}
