import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    template: ''
})

export class BaseFormComponent {
    saving = false;
    submitted = false;
    form!: FormGroup;
    
  get f() { return this.form.controls; }

  beforeSubmit() : boolean {
    this.submitted = true;
    if (this.saving) return false;
    this.saving = true;

    if (this.form.invalid) {
      this.saving = false;
      return false;
    }
    return true;
  }
}
