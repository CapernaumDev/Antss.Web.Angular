import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './my-profile.component.html'
})
export class MyProfileComponent {
  constructor() {}

  onSubmit() {}
}
