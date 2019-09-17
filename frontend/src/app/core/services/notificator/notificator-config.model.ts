export type notificatorAction = 'webService' | 'windowBrowser';
export type crmViewType = 'newWindow' | 'thisWindow';

export interface NotificatorConfig {
  enabled: boolean;
  type: string;
  action: notificatorAction;
  autoOpen: boolean;
  message: boolean;
  closeAutomatically: boolean;
  url: string;
  crmView: crmViewType;
}
