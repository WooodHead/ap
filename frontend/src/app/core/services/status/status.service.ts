import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  config = {
    isInCall: ['internal', 'dialing', 'ptalking', 'talking', 'hold'],
    isRinging: ['ringing'],
    isIdle: ['idle'],
    shouldCalcAvg: ['talkout', 'hold'],
    isDialerInCall: ['incall'],
    isDialerReady: ['ready'],
    shoulddSetLeadFrom: ['paused', 'queue'],
    shouldShowRateSnackbarTo:  ['idle', 'ready', 'break', 'ready', 'paused'],
    shouldShowRateSnackbarFrom: ['talking', 'hold', 'incall'],
  };

  check(key: string, status: string): boolean {
    if (!status) return false;
    return this.config[key].includes(status.toLowerCase());
  }

  shouldShowRateSnackbar(status: string, oldStatus: string): boolean {
    return (
      this.config.shouldShowRateSnackbarTo.includes(status.toLowerCase())
      && this.config.shouldShowRateSnackbarFrom.includes(oldStatus.toLowerCase())
    );
  }

  shouldShowDispoModal(status: string, oldStatus: string) {
    return status === 'PAUSED' && oldStatus === 'INCALL';
  }

  shouldSetLead(status: string, oldStatus: string) {
    return status === 'INCALL' 
      && this.config.shoulddSetLeadFrom.includes(oldStatus.toLowerCase());
  }
}
