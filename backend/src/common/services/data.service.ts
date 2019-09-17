import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DataService {
  private getStatus(data) {
    let status = data.Status;
    const extensionStatus = data.ExtensionStatus;

    switch (extensionStatus) {
      case 'UNREACHABLE':
      case 'HOLD':
      case 'RINGING':
        status = extensionStatus;
        break;

      case 'BUSY':
        switch (status) {
          case 'IDLE':
            status = 'INTERNAL';
            break;

          case 'PAUSED':
            status = 'PTALKING';
            break;

          // FIXME remove after fix in AQM
          // problem: call external -> pause -> un pause: status will be talking instead of talkout
          case 'TALKOUT':
            status = 'TALKING';
            break;

          default:
            // data.Status;
        }
        break;

      default: // OK
        switch (status) {
          case 'PAUSED':
            status = data.PauseReason;
            break;
        }

    }

    return status;
  }

  normalize(data) {
    data.TotalCallDurationWith = data.TotalCallDuration + data.TotalDialDuration;
    data.LoginTime = data.LastLogin;
    data.Status = this.getStatus(data);

    return data;
  }

  isLoggedOut(data) {
    return data.Status === 'LOGGEDOUT';
  }
}
