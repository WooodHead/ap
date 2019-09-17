import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import * as  JsSIP from 'jssip';
import { WebRTCSetCaller, WebRTCSetStatus } from '@app/header/store/webrtc.actions';
import { WebRTCConfig, WebRTCState } from '@app/header/store/webrtc.state';
import { ringtoneConfig } from '@app/core/services/web-rtc/ringtone.config';

const callOptions = { mediaConstraints: { audio: true, video: false } };

type ringtoneType = 'ringtone' | 'ringbacktone';

@Injectable({
  providedIn: 'root',
})
export class WebRTCService {
  config: WebRTCConfig;
  ua: JsSIP.UA;
  session: any;
  audio: any;
  ringtones = {};
  activeRingtones = {};

  // FIXME Should inject config
  constructor(private store: Store) {
    this.config = store.selectSnapshot(WebRTCState.getConfig);
    this.audio = document.createElement('audio');

    this.createRingtones();

    JsSIP.debug.disable('JsSIP:*');
  }

  private createRingtones() {
    Object
      .keys(ringtoneConfig)
      .forEach((type) => {
        this.ringtones[type] = document.createElement('audio');
        this.ringtones[type].src = `/assets/sounds/${type}.wav`;
      });
  }

  login() {
    const socket = new JsSIP.WebSocketInterface(this.config.socket);

    const configuration = {
      sockets: [socket],
      uri: this.config.uri,
      password: this.config.password,
    };

    this.ua = new JsSIP.UA(configuration);

    this.ua.on('newRTCSession', (e) => {
      this.session = e.session;

      // provide sound for outgoing/incomin calls
      if (this.session.direction === 'outgoing') { // OUT
        this.session.connection.addEventListener('addstream', this.setAudio.bind(this));

        this.session.on('progress', ({ response }) => {
          switch (response.status_code) {
            case 180:
              this.playRingtone('ringbacktone');
              break;
            case 183:
              this.stopRingtone('ringbacktone');
              break;
          }
        });
      } else { // IN
        this.playRingtone('ringtone');

        this.store.dispatch(new WebRTCSetCaller(this.session.remote_identity.display_name));

        this.session.on('peerconnection', (data) => {
          data.peerconnection.addEventListener('addstream', this.setAudio.bind(this));
        });

        this.session.on('ended', () => {
          this.store.dispatch(new WebRTCSetCaller(null));
        });

        this.session.on('failed', () => {
          this.store.dispatch(new WebRTCSetCaller(null));
        });
      }
    });

    this.ua.on('connecting', () => this.store.dispatch(new WebRTCSetStatus('connecting')));
    this.ua.on('connected', () => this.store.dispatch(new WebRTCSetStatus('connected')));
    this.ua.on('disconnected', () => this.store.dispatch(new WebRTCSetStatus('disconnected')));

    this.ua.on('registrationFailed', () => {
      this.store.dispatch(new WebRTCSetStatus('failed'));
      this.ua.stop();
    });

    this.ua.start();
  }

  answer() {
    this.session.answer(callOptions);
  }

  reconnect() {
    if (this.ua) this.ua.start();
  }

  call(phoneNumber) {
    this.ua.call(phoneNumber, callOptions);
  }

  hangup() {
    this.session.terminate();
  }

  hold() {
    // FIXME play music on customer's side
    if (this.session.isOnHold().local) {
      this.session.unhold();
    } else {
      this.session.hold();
    }
  }

  transfer(phoneNumber) {
    this.session.refer(phoneNumber);
  }

  sendDTMF(value) { //  Dual Tone – Multi Frequency
    this.session.sendDTMF(value);
  }

  logout() {
    if (this.ua) this.ua.stop();
  }

  private setAudio(event) {
    this.audio.srcObject = event.stream;
    this.audio.play();
  }

  private playRingtone(type: ringtoneType) {
    this.activeRingtones[type] = {
      ringtone: this.ringtones[type],
      interval: null,
    };

    this.activeRingtones[type].ringtone.play();

    this.activeRingtones[type].interval = setInterval(
      () => this.activeRingtones[type].ringtone.play(),
      ringtoneConfig[type].interval,
    );

    // stop after answer / drop
    this.session.on('accepted', () => this.stopRingtone(type));
    this.session.on('failed', () => this.stopRingtone(type));
  }

  private stopRingtone(type: ringtoneType) {
    clearInterval(this.activeRingtones[type].interval);
    this.activeRingtones[type].ringtone.pause();
    this.activeRingtones[type].ringtone.currentTime = 0;
  }
}
