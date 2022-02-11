import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavMenuComponent } from '@app/core/components/nav-menu.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { BaseFormComponent } from './components/base-form-component';
import { PreventDoubleSubmitDirective } from './directives/prevent-double-submit.directive';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AutocompleteFormControl } from './form-controls/autocomplete-form-control';
import { SortableDirective } from './directives/sortable.directive';
import { SortableHeaderComponent } from './components/sortable-header.component';
import { FilterInputComponent } from './components/filter-input.component';
import { FilterSourceDirective } from './directives/filter-source.directive';


@NgModule({
  declarations: [
    NavMenuComponent,
    BaseFormComponent,
    SortableHeaderComponent,
    FilterInputComponent,
    AutocompleteFormControl,
    PreventDoubleSubmitDirective,
    SortableDirective,
    FilterSourceDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FontAwesomeModule,
    NgbTypeaheadModule
  ],
  exports: [
    NavMenuComponent,
    BaseFormComponent,
    SortableHeaderComponent,
    FilterInputComponent,
    AutocompleteFormControl,
    PreventDoubleSubmitDirective,
    SortableDirective,
    FilterSourceDirective
  ]
})

export class CoreModule { 
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
    library.addIcons(faUserCircle);
  }
}
