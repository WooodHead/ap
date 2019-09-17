import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss'],
})
export class IframeComponent {
  iframeUrl: SafeResourceUrl;

  @Input() set url(val: string) {
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(val);
  }

  constructor(private sanitizer: DomSanitizer) {}
}
