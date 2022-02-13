import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { MockDirective } from 'ng-mocks';
import { of } from 'rxjs';
import { AutocompleteFormControl } from './autocomplete-form-control';

describe('AutocompleteFormControl', () => {
  let component: AutocompleteFormControl;
  let fixture: ComponentFixture<AutocompleteFormControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteFormControl, MockDirective(NgbTypeahead) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteFormControl);
    component = fixture.componentInstance;
    component.optionItems = of([
      { value: 1, label: 'a' },
      { value: 2, label: 'abc' },
      { value: 3, label: 'abcd' },
      { value: 4, label: 'bcD' },
      { value: 5, label: 'Cdefg' },
      { value: 6, label: 'gh' },
    ]);
    fixture.detectChanges();
  }); 

  it('should create', () => {
    expect(component).toBeTruthy();
  }); 

  describe('search method', () => {
    //we are going to test code a bit here instead of behaviour as we're working around ngbTypeahead
    it ('should return filtered options according to input parameter', () => {
      component.search(of('cd')).subscribe(x => {
        expect(x).toEqual([
          { value: 3, label: 'abcd' },
          { value: 4, label: 'bcD' },
          { value: 5, label: 'Cdefg' }
        ])        
      });
    });

    it ('should return all items when empty parameter', fakeAsync(() => {
      component.search(of('')).subscribe(x => {
        expect(x.length).toEqual(6);        
      });
    }));
  });
  
});
