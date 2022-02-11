import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from '@app/core/components/base-form-component';
import { Store } from '@ngrx/store';
import { loginWithCredentials } from '@core/store/actions-ui';

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
})

export class LoginComponent extends BaseFormComponent implements OnInit {
  userId: number = 0;
  emailAddress!: string;
  password!: string;

  constructor(private formBuilder: FormBuilder, private store: Store) { 
    super();    
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (!super.beforeSubmit()) return;

    this.store.dispatch(loginWithCredentials( { loginCredential: this.form.value }));
  }
}
