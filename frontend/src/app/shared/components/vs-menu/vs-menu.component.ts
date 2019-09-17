import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from '@app/shared/components/vs-menu/models/menu-item.model';

@Component({
  selector: 'vs-menu',
  templateUrl: './vs-menu.component.html',
})
export class VSMenuComponent {
  @Input() title: String;
  @Input() list: MenuItem[];
  @Input() hasBackdrop: Boolean = true;

  @Output() clicked = new EventEmitter();
}
