import { NotificatorConfig } from '@app/core/services/notificator/notificator-config.model';

const urlMapObj = {
  '[AGENT]': 'QueueMember',
  '[EXT]': 'Extension',
  '[NUMBER]': 'TalkingTo',
  '[POPNUMBER]': 'PopUpNumber',
  '[POPNAME]': 'PopUpNumber',
  '[RINGNUMBER]': 'RingNumber',
  '[RINGNAME]': 'RingName',
  '[EX1]': 'PopUpExtra1',
  '[EX2]': 'PopUpExtra2',
  '[NAME]': 'CallerIDName',
  '[UID_IN_ANSWER]': 'NotifUidInAnswer',
  '[UID_IN_RING]': 'NotifUidInRing',
  '[UID_OUT]': 'NotifUidOUT',
  '[UID_POPUP]': 'NotifUidPopUp',
};

declare var window: any;

export class NotificatorService {
  autoOpen: boolean;
  type: string;
  notificatorUrl: string;
  url: string;

  constructor(config: NotificatorConfig) {
    const {
      url,
    } = config;

    this.notificatorUrl = this.parseUrl(url);
  }

  open(): void {}

  setUrl(data) {
    this.url = window.encodeURI(this.buildUrl(data));
  }

  resetUrl() {
    this.url = null;
  }

  private buildUrl(data): string {
    const match = this.notificatorUrl.match(/\[\w+]/g);
    if (!match) { return this.notificatorUrl; }
    return match
      .reduce(
        (res, key) => res.replace(key, data[urlMapObj[key]]), this.notificatorUrl,
      );
  }

  private parseUrl(url: string): string {
    // If url doesn't have http:// or https:// add // before
    const regex = /^(http:\/\/|https:\/\/)/;

    if (regex.exec(url) === null) {
      return `//${url}`;
    }

    return url;
  }

}
