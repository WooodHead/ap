interface AMIActionParamsVariable {
  __AGENTCODE: string;
  __AGENT_EXT?: string;
  __PAUSEREASON?: string;
}

export class AMIActionParams {
  static generateActionId(actionId) {
    return `${actionId}-${Math.floor(Date.now() / 1000)}`;
  }

  readonly priority = 1;
  readonly timeout =  60000;
  readonly async = true;

  action = 'originate';
  channel = 'Local/answer@from-agent';
  context = 'from-agent';
  callerid = 'API';

  exten: string;
  actionid?: string;
  variable?: AMIActionParamsVariable;

  constructor(params) {
    Object
      .keys(params)
      .forEach(key => this[key] = params[key]);
  }
}
