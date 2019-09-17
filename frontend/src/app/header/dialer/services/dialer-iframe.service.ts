import { Injectable } from '@angular/core';
import { ConfigService } from '@app/core/services/config/config.service';
import { panelMode, dialerSessionData, dialerCampaignsActive } from '@app/shared/constants/local-storage.constants';

const pageBeforeUnloadHandler = (e) => {
  e.preventDefault();
  e.returnValue = '';
};

const pageUnloadHandler = () => {
  localStorage.setItem(panelMode, '"call-center"');
  localStorage.setItem(dialerSessionData, null);
  localStorage.setItem(dialerCampaignsActive, null);
};

@Injectable({
  providedIn: 'root',
})
export class DialerIframeService {
  private readonly iframeId = 'vici';

  constructor(
    private config: ConfigService
    ) {}

  private querystring(params) {
    return Object
      .keys(params)
      .map(key => key + '=' + params[key]).join('&');
  }

  create(data) {
    const params = {
      phone_login: data.extension,
      phone_pass: data.extension,
      extension: data.extension,
      VD_login: data.agent,
      VD_pass: data.agent,
      VD_campaign: data.campaign,
    };

    this.destroy();

    const iframe = document.createElement('iframe');
    iframe.id = this.iframeId;
    iframe.src = `http://${this.config.dialerUrl}/agc/vicidial.php?${this.querystring(params)}`;

    window.document.body.appendChild(iframe);
    window.onbeforeunload = pageBeforeUnloadHandler;
    window.onunload = pageUnloadHandler;
  }

  destroy() {
    if (document.getElementById(this.iframeId)) {
      document.getElementById(this.iframeId).remove();
    }
    window.onbeforeunload = null;
    window.onunload = null;
  }
}
