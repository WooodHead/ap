import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'vs-recently-used',
  templateUrl: './vs-recently-used.component.html',
  styleUrls: ['./vs-recently-used.component.scss'],
})
export class VSRecentlyUsedComponent {
  @Input() form: FormGroup;
  @Input() field: string;
  @Input() disabled: boolean;
  @Input() list: any[];

  @Output() clicked = new EventEmitter();
}
