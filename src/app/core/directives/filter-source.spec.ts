import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FilterSourceDirective } from './filter-source.directive';

@Component({
  template: `<input filterSource />`
})
class TestComponent {}

describe('FilterSourceDirective', () => {
  let directiveInstance: FilterSourceDirective;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, FilterSourceDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    const directiveEl = fixture.debugElement.query(By.directive(FilterSourceDirective));
    directiveInstance = directiveEl.injector.get(FilterSourceDirective);
    fixture.detectChanges();
  });

  it('should emit filter event with filter term when filter is called', () => {
    spyOn(directiveInstance.filterChange, 'emit');
    directiveInstance.filter('abc');
    fixture.detectChanges();

    expect(directiveInstance.filterChange.emit).toHaveBeenCalledOnceWith({ filterTerm: 'abc' });
  });
});
