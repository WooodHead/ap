import { Injectable, EventEmitter } from '@angular/core';
import { SnackBarService } from '@app/shared/components/vs-snackbar/snackbar.service';
import { Config } from './models/config.model';
import { HttpService } from '@app/core/services/http/http.service';
import { Store } from '@ngxs/store';
import { UserState } from '../../../auth/store/user.state';

@Injectable()
export class ConfigService {
  private config: Config;

  configLoad = new EventEmitter<Config>();

  constructor(
    private http: HttpService,
    private snackBar: SnackBarService,
    private store: Store,
  ) {}

  get pauses() {
    return this.config.pauses;
  }

  get columns() {
    return this.config.columns;
  }

  get notificator() {
    return this.config.notificator;
  }

  get dialerUrl() {
    return this.config.dialerUrl;
  }

  get language() {
    return this.config ? this.config.language : 'en';
  }

  get version() {
    return this.config.version;
  }

  get dialerEnabled() {
    return this.config.dialerEnabled;
  }

  get dispositionCallAutomatically() {
    return this.config.dispositionCallAutomatically;
  }
  
  get enableDispositionModal() {
    return this.config.enableDispositionModal;
  }
  
  get agentPanel() {
    return this.config.agentPanel;
  }

  get port() {
    return this.config.port;
  }

  get webrtc() {
    return this.config && this.config.webrtc;
  }

  load() {
    const initialConfig = window.location.hash === '#/' ? true : false;
    const userId = this.store.selectSnapshot(UserState.getAgentId);
    let url = `config?initial=${initialConfig}`;
    if(userId) {
      url += `&userId=${userId}`;
    }

    const promise = this.http
      .get(url)
      .toPromise()
      .then(settings => { 
        this.config = settings;
        this.configLoad.emit(this.config);
        return this.config;
      })
      .catch((err) => {
        this.snackBar.open({
          message: (err.message || err) + '. Please try again later',
          action: 'OK',
        });

        return null;
      });

    return promise;
  }
}

export function configInitializer(configService: ConfigService) {
  return () => configService.load();
}
