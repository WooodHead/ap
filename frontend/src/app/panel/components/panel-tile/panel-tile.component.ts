import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-panel-tile',
  templateUrl: './panel-tile.component.html',
  styleUrls: ['./panel-tile.component.scss'],
})
export class PanelTileComponent {
  @Input() key: any;
  @Input() data: any;
  @Input() display: string;

  getClassName() {
    let className = `mat-card ${this.key}`;

    if (this.key === 'Status') {
      className += ` ${this.data.replace(/\s/g, '-')}`;
    }

    return className.toLowerCase();
  }
}
