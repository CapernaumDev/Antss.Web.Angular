import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockProvider } from 'ng-mocks';
import { SortableDirective } from '../directives/sortable.directive';

import { SortableHeaderComponent } from './sortable-header.component';

describe('SortableHeaderComponent', () => {
  let component: SortableHeaderComponent;
  let fixture: ComponentFixture<SortableHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ 
        SortableHeaderComponent
      ],
      providers: [
        MockProvider(SortableDirective)
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sort on the sort source when clicked', () => {
    fixture.debugElement.query(By.css('div')).nativeElement.click();
    fixture.detectChanges();

    expect(component.sortable.sort).toHaveBeenCalled();
  });

  it('should show up arrow when sortable direction is ascending', () => {
    component.sortable.direction = 'asc';
    fixture.detectChanges();
    let div = fixture.debugElement.query(By.css('[data-test-id="showSortOrder"]')).nativeElement;
    expect(div.attributes['class'].value).toBe('arrow asc');
  });

  it('should show down arrow when sortable direction is descending', () => {
    component.sortable.direction = 'desc';
    fixture.detectChanges();
    let div = fixture.debugElement.query(By.css('[data-test-id="showSortOrder"]')).nativeElement;
    expect(div.attributes['class'].value).toBe('arrow desc');
  });

  it('should hide arrow when sortable direction is null', () => {
    component.sortable.direction = null;
    fixture.detectChanges();
    let div = fixture.debugElement.query(By.css('[data-test-id="showSortOrder"]')).nativeElement;
    expect(div.attributes['class'].value).toBe('arrow hide');
  });
});
