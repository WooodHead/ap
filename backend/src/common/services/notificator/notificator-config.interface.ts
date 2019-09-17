type NotificatorType = 'NotifUidPopUp' | 'NotifUidInRing' | 'NotifUidInAnswer' | 'NotifUidOUT';

export interface NotificatorConfig {
  enabled: boolean;
  type: NotificatorType;
}
