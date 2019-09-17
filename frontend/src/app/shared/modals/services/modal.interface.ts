import { MatDialogConfig } from '@angular/material';
import { Observable } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';

export interface Modal {
  openConfirm(type: string): Observable<any>;
  open<T = any>(component: ComponentType<T>, config: MatDialogConfig): Observable<any>;
  close(): void;
}
