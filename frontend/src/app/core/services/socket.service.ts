import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { ConfigService } from '@app/core/services/config/config.service';


interface ConnectionOptions {
  agent: string;
  mode: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: any;
  private connectionOptions: ConnectionOptions;

  constructor(
    private configService: ConfigService
    ) {
      this.configService.configLoad.subscribe(({ port }) => {
        this.initSocket(port);
      });
    }

  connect(options: ConnectionOptions) {
    this.connectionOptions = options;
    this.socket.emit('open_room', options);
  }

  initSocket(port) {
    const host = () => {
      const url = window.location.origin;
      if (url.includes('localhost')) {
        return `http://localhost:${port}`;
      }
      return url;
    }
      this.socket = io(host(), {
        path: `${window.location.pathname}/socket.io`.replace('//', '/'),
      });
      this.socket.on('connect', () => this.connected());
      this.socket.on('disconnect', () => this.disconnected());
      this.socket.on('error', (error: string) => console
        .log(`ERROR: '${error}' (${host()})`));
  }

  disconnect() {
      this.socket.disconnect();
  }

  emit(chanel, message) {
    return new Observable<any>((observer) => {
      console.log(`emit to ${chanel}:`, message);
      this.socket.emit(chanel, message, (data) => {
        if (data.success) {
          observer.next(data.msg);
        } else {
          observer.error(data.msg);
        }
        observer.complete();
      });
    });
  }

  on(eventName) {
    return new Observable<any>((observer) => {
      this.socket.off(eventName);
      this.socket.on(eventName, (data) => {
        data.payload.Status =
          data.payload.Status === 'PAUSED' && data.payload.external_pause_reason ?
          data.payload.external_pause_reason :
          data.payload.Status;
        observer.next(data);
      });
    });
  }

  private connected() {
    // handle reconnect
    if (this.connectionOptions) {
      this.connect(this.connectionOptions);
    }
  }

  private disconnected() {
    console.log('socket.service.ts::disconnected::75 >>>> ', ' DISCONNECTED');
  }
}
