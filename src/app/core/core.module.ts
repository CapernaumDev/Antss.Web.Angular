import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '@app/core/components/nav-menu.component';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons/faUserCircle';
import { BaseFormComponent } from './components/base-form-component';
import { PreventDoubleSubmitDirective } from './directives/prevent-double-submit.directive';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteFormControlComponent } from './form-controls/autocomplete-form-control';
import { SortableDirective } from './directives/sortable.directive';
import { SortableHeaderComponent } from './components/sortable-header.component';
import { FilterInputComponent } from './components/filter-input.component';
import { FilterSourceDirective } from './directives/filter-source.directive';
import { FilterSectionComponent } from './components/filter-section.component';

@NgModule({
  declarations: [
    NavMenuComponent,
    BaseFormComponent,
    SortableHeaderComponent,
    FilterInputComponent,
    AutocompleteFormControlComponent,
    PreventDoubleSubmitDirective,
    SortableDirective,
    FilterSourceDirective,
    FilterSectionComponent
  ],
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule, NgbTypeaheadModule, ReactiveComponentModule],
  exports: [
    NavMenuComponent,
    BaseFormComponent,
    SortableHeaderComponent,
    FilterInputComponent,
    AutocompleteFormControlComponent,
    PreventDoubleSubmitDirective,
    SortableDirective,
    FilterSourceDirective,
    FilterSectionComponent
  ]
})
export class CoreModule {
  constructor() {
    library.add(faUserCircle, faEnvelope);
  }
}
