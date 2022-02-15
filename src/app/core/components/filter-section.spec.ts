import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { DataSource } from '../data-source';
import { FilterSourceDirective } from '../directives/filter-source.directive';
import { SetFilterEvent } from '../interfaces/set-filter-event';
import { SortChangeEvent } from '../interfaces/sort-change-event';

import { FilterSectionComponent } from './filter-section.component';

class TestDataSourceSubject {}
class TestDataSourceImpl extends DataSource<TestDataSourceSubject> {
  sortLogic(sorter: SortChangeEvent, data: TestDataSourceSubject[]): TestDataSourceSubject[] {
    return [];
  }
  filterLogic(setFilterEvent: SetFilterEvent, data: TestDataSourceSubject[]): TestDataSourceSubject[] {
    return [];
  }
  filterChange() {}
  set filterSource(filterSource: FilterSourceDirective) {
  }
  recordCount$: Observable<number> = of(0);
}
const testDataSource = new TestDataSourceImpl();

describe('FilterSectionComponent', () => {
  let component: FilterSectionComponent<TestDataSourceSubject>;
  let fixture: ComponentFixture<FilterSectionComponent<TestDataSourceSubject>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideMockStore({  })], 
      declarations: [ FilterSectionComponent ]
    })
    .compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent<FilterSectionComponent<TestDataSourceSubject>>(FilterSectionComponent);
    component = fixture.componentInstance;
    component.dataSource = testDataSource;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
