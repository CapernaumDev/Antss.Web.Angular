import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject } from 'rxjs';
import { OptionItem } from '../models/option-item';

@Component({
  selector: 'autocomplete-form-control',
  templateUrl: "autocomplete-form-control.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AutocompleteFormControl
    }
  ]
})

// Makes ngbTypeahead available as a formcontrol with OptionItem[] as available options
// TODO: full implementation of formcontrol validation etc
export class AutocompleteFormControl implements ControlValueAccessor, OnInit {

  @ViewChild('inputElement') inputElement!: HTMLElement;
  @ViewChild('instance', {static: true}) instance!: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  @Input() optionItems!: Observable<OptionItem[]>;
  @Input() elementId!: string;

  selectedItem!: OptionItem;
  allItems: OptionItem[] = [];

  onChange = (selectedValue: number) => { };
  onTouched = () => { };
  touched = false;
  disabled = false;

  formatter = (optionItem: OptionItem) => optionItem.label;

  search: OperatorFunction<string, readonly OptionItem[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.allItems
        : this.allItems.filter(x => x.label.toLowerCase().indexOf(term.toLowerCase()) > -1))
        .slice(0, 10))
    );
  }

  ngOnInit(): void {
    this.optionItems.subscribe(x => this.allItems = x);
  }

  onSelect($event: any, input: any) {
    this.markAsTouched();
    if (!this.disabled) {
      $event.preventDefault();
      this.selectedItem = $event.item;
      input.value = '';

      this.onChange(this.selectedItem.value);
    }
  }

  writeValue(optionItem: OptionItem) {
    this.selectedItem = optionItem;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
