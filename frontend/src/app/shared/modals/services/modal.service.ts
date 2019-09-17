import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import { VSModalComponent } from '@app/shared/modals/vs-modal/vs-modal.component';
import { Modal } from './modal.interface';
import { ComponentType } from '@angular/cdk/portal';
import { modalsConfig } from '@app/shared/modals/modals.config';

@Injectable()
export class ModalService implements Modal {
  private dialogRef: MatDialogRef<any>;

  constructor(private dialog: MatDialog) {}

  public openConfirm(type: string): Observable<any> {
    this.dialogRef = this.dialog.open(VSModalComponent, modalsConfig[type]);
    return this.dialogRef.beforeClose();
  }

  public open<T = any>(component: ComponentType<T> | TemplateRef<T>, config: MatDialogConfig) {
    this.dialogRef = this.dialog.open(component, config);
    return this.dialogRef.beforeClose();
  }

  public close(): void {
    this.dialogRef.close();
  }
}
