import { NotificatorConfig } from '@app/core/services/notificator/notificator-config.model';
import { Pause } from '@app/core/services/config/models/pause.model';
import { Column } from '@app/core/services/config/models/column.model';

type Language = 'en';

export interface Config {
  columns: {
    dialer: Column[],
    'call-center': Column[],
  };
  pauses: Pause[];
  dialerEnabled: boolean;
  dispositionCallAutomatically: boolean;
  dialerUrl: string;
  enableDispositionModal: boolean;
  notificator: NotificatorConfig;
  language: Language;
  version: string;
  agentPanel: AgentPanel;
  webrtc?: boolean;
  port: number;
};

interface AgentPanel {
  actions: {
    dialer: {
      showAnswerMachine: boolean;
    }
  }
};
