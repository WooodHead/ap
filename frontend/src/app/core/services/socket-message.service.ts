import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { SocketService } from '@app/core/services/socket.service';

@Injectable({
  providedIn: 'root',
})
export class SocketMessageService implements OnDestroy {
  constructor(
    private store: Store,
    private socketService: SocketService,
  ) {}

  listen(options: { agent: string, mode: string }) {
    this.socketService.connect(options);

    return this.socketService
      .on('DISPATCH_ACTION')
      .subscribe(data => this.store.dispatch(data));
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }
}
