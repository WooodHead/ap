import { Component, Input } from '@angular/core';

@Component({
  selector: 'vs-spinner',
  templateUrl: './vs-spinner.component.html',
  styleUrls: ['./vs-spinner.component.scss'],
})
export class VSSpinnerComponent {
  @Input() diameter = 50;
}
