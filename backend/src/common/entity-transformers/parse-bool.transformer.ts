import { ValueTransformer } from 'typeorm/decorator/options/ValueTransformer';

export class ParseBoolTransformer implements ValueTransformer {

  public from(value?: any) {
    return Boolean(value);
  }

  public to(value?: any) {
    return value;
  }
}
