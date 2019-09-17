import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'vs-icon',
  templateUrl: './vs-icon.component.html',
  styleUrls: ['./vs-icon.component.scss'],
})
export class VSIconComponent implements OnInit {
  @Input() size: number;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.size) {
      const styles = this.el.nativeElement.firstElementChild.style;
      const size = `${this.size}px`;

      styles.fontSize = size;
      styles.width = size;
      styles.height = size;
      styles.lineHeight = size;
    }
  }
}
