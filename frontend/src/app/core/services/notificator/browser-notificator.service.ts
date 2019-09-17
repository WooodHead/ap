import { Injectable } from '@angular/core';
import { ConfigService } from '@app/core/services/config/config.service';

// FIXME: Remove when TS 3.0 is released.
// Needed due to wrong Notification typings
declare var Notification: any;

@Injectable({
  providedIn: 'root',
})
export class BrowserNotificatorService  {
  private title: string;

  // FIXME: Map options in ctor obj on notificatorType
  // Move mapping objects somewhere. Config || Inject
  constructor(private config: ConfigService) {
    // FIXME: Need to check if config is set
    this.title = this.getTitle(config.notificator.type);
  }

  notify(data): void {
    const options = this.getOptions(data);
    return new Notification(this.title, options);
  }

  checkPermission() {
    const askForPermission = (resolve, reject) => {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') return resolve(permission);
        return reject(permission);
      });
    };

    return new Promise(askForPermission);
  }

  close() {}

  private getOptions(data) {
    // Clear it up. Options should set up on init.
    const options = {
      body: this.getMessage(data) || 'Voicespin',
      dir: 'auto',
      lang: 'EN',
      tag: 'notificationPopup',
      icon: './assets/img/nlogo.png',
      // FIXME check why not shown at all when "false"
      // requireInteraction: !this.config.notificator.closeAutomatically,
      requireInteraction: true,
    };
    return options;
  }

  private getTitle(type) {
    const titleMap =  {
      outgoingCall: 'Outgoing Call',
      inAnswer: 'Incoming Call',
      inRing: 'Popup',
      custom: 'Incoming Call Ring',
    };

    return titleMap[type] || 'Voicespin';
  }

  private getMessage(data) {
    const mapMessage = (a = ' ', b = ' ') => {
      return `${a}\n${b}`;
    };
    // Move it someweher. Maybe merge with title config
    const messageMap = {
      outgoingCall: mapMessage(data.TalkingTo, data.CallerIDName),
      inAnswer: mapMessage(data.TalkingTo, data.CallerIDName),
      inRing: mapMessage(data.RingNumber, data.RingName),
      custom: mapMessage(data.PopUpName, data.PopUpName),
    };
    return messageMap[this.config.notificator.type];
  }
}
