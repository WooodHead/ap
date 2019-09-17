import { EventEmitter, Input, Output } from '@angular/core';

export class Button {
  @Input() icon: string;
  @Input() tooltip: string;

  @Input() color = 'primary';
  @Input() type = 'button';
  @Input() tabindex =  '-1';
  @Input() disabled =  false;

  @Output() clicked = new EventEmitter();
}
