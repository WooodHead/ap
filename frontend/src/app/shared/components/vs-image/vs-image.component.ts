import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'vs-image',
  templateUrl: './vs-image.component.html',
})
export class VSImageComponent {
  @Input() src: String;
  @Input() width: Number;
  @Input() height: Number;
}
