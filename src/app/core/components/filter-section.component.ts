import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSource } from '../data-source';
import { FilterSourceDirective } from '../directives/filter-source.directive';

@Component({
  selector: 'filter-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-section.component.html'
})

export class FilterSectionComponent<T> implements OnInit {
  recordCount$!: Observable<number>;

  constructor() {
  }

  @Input() dataSource!: DataSource<T>
  @Input() subjectNamePlural!: string;
  @Output() filterTermChangeEvent = new EventEmitter<string>();
  @ViewChild(FilterSourceDirective) filterSource!: FilterSourceDirective;

  ngOnInit(): void {
    this.recordCount$ = this.dataSource.recordCount$;
  }

  ngAfterViewInit() {
    this.dataSource.filterSource = this.filterSource;
  }
}
