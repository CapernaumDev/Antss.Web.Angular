import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockProvider } from 'ng-mocks';
import { FilterSourceDirective } from '../directives/filter-source.directive';

import { FilterInputComponent } from './filter-input.component';

describe('FilterInputComponent', () => {
  let component: FilterInputComponent;
  let fixture: ComponentFixture<FilterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterInputComponent],
      providers: [MockProvider(FilterSourceDirective)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call filter on the filter source with what the user typed after 300ms', fakeAsync(() => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    inputElement.value = 'abc';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick(301);
    expect(component.filter.filter).toHaveBeenCalledOnceWith('abc');
  }));

  it('should not immediately call filter on the filter source when the user inputs', () => {
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    inputElement.value = 'abc';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.filter.filter).not.toHaveBeenCalled();
  });
});
