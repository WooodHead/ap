import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

export class CoalesceTransformer<TFrom, TTo> implements ValueTransformer {

  private defaultValueFrom: TFrom;
  private defaultValueTo: TTo;

  constructor(defaultValueFrom?: TFrom, defaultValueTo?: TTo) {
    this.defaultValueFrom = defaultValueFrom;
    this.defaultValueTo = defaultValueTo;
  }

  public from(value?: TFrom): TFrom {
    return value || this.defaultValueFrom;
  }

  public to(value?: TTo): TTo {
    return value || this.defaultValueTo;
  }
}
