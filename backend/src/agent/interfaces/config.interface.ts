import { Column } from './column.interface';
import { Pause } from '../call-center/interfaces/pause.interface';

export interface Config {
  columns?: Column[];
  pauses?: Pause[];
  enableNotificator?: boolean;
  notificatorConfig?: any;
  language: string;
  version: string;
}
