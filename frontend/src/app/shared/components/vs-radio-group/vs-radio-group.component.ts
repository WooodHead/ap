import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'vs-radio-group',
  templateUrl: './vs-radio-group.component.html',
  styleUrls: ['./vs-radio-group.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => VSRadioGroupComponent),
    multi: true,
  }],
})
export class VSRadioGroupComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() list: any;

  disabled: boolean;
  value: any;

  constructor(private cd: ChangeDetectorRef) {}

  onChange = (value: any) => {};
  onTouched = () => {};

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    if (value !== this.value) {
      this.value = value;
      this.cd.markForCheck();
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
