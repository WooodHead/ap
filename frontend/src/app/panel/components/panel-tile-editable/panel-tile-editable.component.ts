import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { PanelTileComponent } from '@app/panel/components/panel-tile/panel-tile.component';
import { MatInput } from '@angular/material';

const ENTER_KEY_CODE = 13;
const ESCAPE_KEY_COPE = 27;

@Component({
  selector: 'app-panel-tile-editable',
  templateUrl: './panel-tile-editable.component.html',
  styleUrls: ['../panel-tile/panel-tile.component.scss', './panel-tile-editable.component.scss'],
})
export class PanelTileEditableComponent extends PanelTileComponent implements OnInit {
  editMode = false;
  value: string;

  @Output('update') update = new EventEmitter();
  @ViewChild(MatInput) input;

  ngOnInit() {
    this.value = this.data ? this.data : '';
  }

  setEditMode() {
    this.editMode = true;

    // wait until input will be rendered
    setTimeout(() => this.input.focus(), 0);
  }

  onKey(e) {
    switch (e.keyCode) {
      case ENTER_KEY_CODE:
        this.onSave();
        break;

      case ESCAPE_KEY_COPE:
        this.onCancel();
        break;
    }
  }

  onSave(e?: any) {
    if (e) e.stopPropagation();

    this.editMode = false;
    this.data = this.value || undefined;
    this.update.emit({ [this.key]: this.data });
  }

  onCancel(e?: any) {
    if (e) e.stopPropagation();

    this.editMode = false;
    this.value = this.data || '';
  }
}
