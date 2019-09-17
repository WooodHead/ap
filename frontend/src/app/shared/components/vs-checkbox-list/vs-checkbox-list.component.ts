import { Component, Input } from '@angular/core';

@Component({
  selector: 'vs-checkbox-list',
  templateUrl: './vs-checkbox-list.component.html',
})
export class VSCheckboxListComponent {
  @Input() list: any;
}
