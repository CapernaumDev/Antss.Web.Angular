import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ApiService } from '@core/api.service';
import { FormModes } from '@app/core/enums/form-modes';
import { User } from '@app/core/models/user/user';
import { OptionItem } from '@core/models/option-item';
import { BaseFormComponent } from '@app/core/components/base-form-component';
import { Store } from '@ngrx/store';
import { AppState } from '@app/core/store/app.state';
import { selectLoadedUser, selectOffices, selectUserTypes } from '@app/core/store/selectors';
import { createUserRequested, loadUserRequested, updateUserRequested } from '@app/core/store/actions-ui';

@Component({
  selector: 'create-user',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user.component.html'
})

export class UserComponent extends BaseFormComponent implements OnInit {
  FormModes = FormModes;
  public offices$!: Observable<OptionItem[]>;
  public userTypes$!: Observable<OptionItem[]>;
  public editingUser$!: Observable<User | null>;

  formMode: FormModes = FormModes.Create;
  formModeDescription: string = 'Create';
  userId!: number;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, 
    private router: Router, private route: ActivatedRoute,
    private store: Store<AppState>) {
    super();

    this.offices$ = this.store.select(selectOffices);
    this.userTypes$ = this.store.select(selectUserTypes);
    this.editingUser$ = this.store.select(selectLoadedUser);
  }

  onSubmit() {
    if (!super.beforeSubmit()) return;
    
    if (this.formMode == FormModes.Create) {
      this.store.dispatch(createUserRequested({ user: this.form.value }));
    } else {
      this.store.dispatch(updateUserRequested({ user: { ...this.form.value, id: this.userId } }));
    }
  }

  cancelAndReturn() {
    if (this.form.dirty && !confirm("Are you sure you wish to cancel?")) return;

    this.router.navigate(['user-list'])
  }

  ngOnInit() {
    this.subscriptions.push(this.editingUser$.pipe(
      filter(x => x != null)
    ).subscribe(x => {
      if (!x || !this.form) return;

      this.form.patchValue(x);
      this.form.patchValue({userTypeId: x.userTypeId.toString()}); //TODO: string / int mismatch but same numeric id
    }));

    this.subscriptions.push(this.route.queryParams.subscribe(params => {
      const routeParams = this.route.snapshot.paramMap;
      this.userId = Number(routeParams.get('id'));
      
      if (this.userId)
        this.store.dispatch(loadUserRequested({ userId: this.userId }));
      
      let editing = this.userId > 0;
      this.formMode = editing ? FormModes.Edit : FormModes.Create;
      
      this.form = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        emailAddress: ['', [Validators.required, Validators.email]],
        userTypeId: ['', [Validators.required]],
        officeId: ['', [Validators.required]],
        contactNumber: ['', [Validators.required]],
        password: ['', Validators.required]
      });

      if (editing)
        this.form.controls["password"].removeValidators([Validators.required]);

      this.formModeDescription = editing ? "Edit" : "Create";
    }));
  }
  ngOnDestroy() {
    this.subscriptions.forEach(x => {
      if (!x.closed) {
        x.unsubscribe();
      }
    });
  }
}

