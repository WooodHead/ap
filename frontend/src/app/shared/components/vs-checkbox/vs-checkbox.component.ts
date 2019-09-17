import { Component, Input } from '@angular/core';

@Component({
  selector: 'vs-checkbox',
  templateUrl: './vs-checkbox.component.html',
})
export class VSCheckboxComponent {
  @Input() label: String;
  @Input() labelPosition: String;
}
