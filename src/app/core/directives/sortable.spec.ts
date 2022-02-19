import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SortableDirective } from './sortable.directive';

@Component({
  template: `<th sortable></th>`
})
class TestComponent {}

describe('SortableDirective', () => {
  let directiveInstance: SortableDirective;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, SortableDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    const directiveEl = fixture.debugElement.query(By.directive(SortableDirective));
    directiveInstance = directiveEl.injector.get(SortableDirective);
    fixture.detectChanges();
  });

  it('should emit sort event with column parameter when sort is called', () => {
    spyOn(directiveInstance.sortChangeEvent, 'emit');
    directiveInstance.sort('abc');
    fixture.detectChanges();

    expect(directiveInstance.sortChangeEvent.emit).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ column: 'abc' })
    );
  });

  it('should emit sort event with ascending direction when called first time', () => {
    spyOn(directiveInstance.sortChangeEvent, 'emit');
    directiveInstance.sort('abc');
    fixture.detectChanges();

    expect(directiveInstance.sortChangeEvent.emit).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ direction: 'asc' })
    );
  });

  it('should emit sort event with descending direction when called second time', () => {
    directiveInstance.sort('abc');
    fixture.detectChanges();
    const spy = spyOn(directiveInstance.sortChangeEvent, 'emit');
    directiveInstance.sort('abc');
    fixture.detectChanges();

    expect(directiveInstance.sortChangeEvent.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({ direction: 'desc' })
    );
  });

  it('should emit sort event with null direction when called third time', () => {
    directiveInstance.sort('abc');
    fixture.detectChanges();
    directiveInstance.sort('abc');
    fixture.detectChanges();
    const spy = spyOn(directiveInstance.sortChangeEvent, 'emit');
    directiveInstance.sort('abc');
    fixture.detectChanges();

    expect(directiveInstance.sortChangeEvent.emit).toHaveBeenCalledWith(jasmine.objectContaining({ direction: null }));
  });

  it('should emit sort event with ascending direction when called fourth time', () => {
    directiveInstance.sort('abc');
    fixture.detectChanges();
    directiveInstance.sort('abc');
    fixture.detectChanges();
    directiveInstance.sort('abc');
    fixture.detectChanges();
    const spy = spyOn(directiveInstance.sortChangeEvent, 'emit');
    directiveInstance.sort('abc');
    fixture.detectChanges();

    expect(directiveInstance.sortChangeEvent.emit).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({ direction: 'asc' })
    );
  });
});
