import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { fadeAnimation } from '@app/shared/animations/fade.animation';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { UpdateTable, UpdateTableItem } from '@app/panel/store/table.actions';
import { UpdateLead } from '@app/header/dialer/store/dialer.actions';

@Component({
  selector: 'app-panel-tile-list',
  templateUrl: './panel-tile-list.component.html',
  styleUrls: ['./panel-tile-list.component.scss'],
  animations: [fadeAnimation],
})
export class PanelTileListComponent {
  @Input() data: any;
  @Input() columns: any;

  constructor(
    private cd: ChangeDetectorRef,
    private actions$: Actions,
    private store: Store,
  ) {
    this.actions$
      .pipe(
        ofActionSuccessful(UpdateTable),
      )
      .subscribe(() => {
        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      });
  }

  updateTableItem(data) {
    this.store.dispatch(new UpdateTableItem(data));
    this.store.dispatch(new UpdateLead(data));
  }
}
