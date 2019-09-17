import { Injectable } from '@angular/core';
import { ViewType } from './view.type';

const windowConfig = {
  top: 0,
  left: 0,
  width: 400,
  height: 190,
  titlebar: 'no',
  menubar: 'no',
  toolbar: 'no',
  location: 'no',
  status: 'no',
  centerscreen: 'yes',
  modal: 'yes',
};

@Injectable({
  providedIn: 'root',
})
export class WindowService {
  viewParams = {
    horizontal: {
      width: this.width,
      left: 0,
    },
    vertical: {
      height: this.height,
      left: this.width - windowConfig.width,
    },
  };

  get width() {
    return window.screen.width;
  }

  get height() {
    return window.screen.height;
  }

  private getViewParams(view: ViewType) {
    return Object.assign({}, windowConfig, this.viewParams[view]);
  }

  private mapViewParams(params) {
    return Object
      .keys(params)
      .map(i => `${i}=${params[i]}`)
      .join(',');
  }

  public open(view: ViewType, agentPanelExists = false) {
    const params = this.getViewParams(view);
    const windowParams = this.mapViewParams(params);

    // if agent panel exists -- just show that window without providing url once again
    const panelUrl = window.location.href + 'panel';
    const url = agentPanelExists ? '' : panelUrl;
    const panelWindow = window.open(url, 'agentPanel', windowParams);

    if (panelWindow.location.href === 'about:blank') {
      panelWindow.location.href = panelUrl;
    }

    // put window on top
    panelWindow.focus();

    // to allow changing view from auth page
    this.changeView(view, panelWindow);
  }

  public changeView(view: ViewType, panelWindow = window) {
    const params = this.getViewParams(view);

    // browser automatically reduces 50px considering app header and url blocks
    if (view === 'horizontal') {
      params.height += 50;
    }

    panelWindow.resizeTo(params.width, params.height);
    panelWindow.moveTo(params.left, params.top);
  }

  public close(agentPanelExists = true) {
    // if agent panel does not exist -- nothing to close, skipping
    if (agentPanelExists) {
      window
          .open('', 'agentPanel')
          .close();
      }
  }
}
