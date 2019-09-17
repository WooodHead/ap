import { Authenticate } from '@app/auth/models/authenticate.model';

export interface Agent extends Authenticate {
  username: string;
}
