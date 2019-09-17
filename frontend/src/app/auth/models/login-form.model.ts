import { Authenticate } from '@app/auth/models/authenticate.model';
import { ViewType } from '@app/core/services/window/view.type';

export interface LoginForm extends Authenticate {
  view: ViewType;
}
