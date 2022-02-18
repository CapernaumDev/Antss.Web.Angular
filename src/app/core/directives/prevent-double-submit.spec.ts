import { Component } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PreventDoubleSubmitDirective } from './prevent-double-submit.directive';

@Component({
  template: ` <form preventDoubleSubmit (throttledOnSubmit)="onSubmit()">
    <button type="submit"></button>
  </form>`
})
class TestComponent {
  onSubmit() {}
}

describe('FilterSourceDirective', () => {
  let directiveInstance: PreventDoubleSubmitDirective;
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent, PreventDoubleSubmitDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    const directiveEl = fixture.debugElement.query(By.directive(PreventDoubleSubmitDirective));
    directiveInstance = directiveEl.injector.get(PreventDoubleSubmitDirective);
    fixture.detectChanges();
  });

  it('should allow form submission when first clicked', () => {
    spyOn(component, 'onSubmit');
    const submitButton = fixture.debugElement.query(By.css('button'));

    submitButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should not allow subsequent submissions for the duration of the timer', () => {
    spyOn(component, 'onSubmit');
    const submitButton = fixture.debugElement.query(By.css('button'));

    submitButton.nativeElement.click();
    fixture.detectChanges();
    submitButton.nativeElement.click();
    fixture.detectChanges();
    submitButton.nativeElement.click();
    fixture.detectChanges();
    submitButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should allow subsequent submissions after the duration of the timer', fakeAsync(() => {
    spyOn(component, 'onSubmit');
    const submitButton = fixture.debugElement.query(By.css('button'));

    submitButton.nativeElement.click();
    fixture.detectChanges();
    tick(500);
    submitButton.nativeElement.click();
    fixture.detectChanges();
    discardPeriodicTasks();

    expect(component.onSubmit).toHaveBeenCalledTimes(2);
  }));
});
