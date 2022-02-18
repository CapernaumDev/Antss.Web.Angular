import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataSource } from '../data-source';
import { FilterSourceDirective } from '../directives/filter-source.directive';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons/faPlusSquare';

@Component({
  selector: 'filter-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-section.component.html'
})
export class FilterSectionComponent<T> implements OnInit, AfterViewInit {
  public faPlusSquare = faPlusSquare;
  recordCount$!: Observable<number>;

  constructor() {}

  @Input() dataSource!: DataSource<T>;
  @Input() subjectNamePlural!: string;
  @Input() subjectNameSingular!: string;
  @Input() newItemRoute!: string;
  @ViewChild(FilterSourceDirective) filterSource!: FilterSourceDirective;

  ngOnInit(): void {
    this.recordCount$ = this.dataSource.recordCount$;
  }

  ngAfterViewInit() {
    this.dataSource.filterSource = this.filterSource;
  }
}
